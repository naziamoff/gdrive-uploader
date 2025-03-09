import { Injectable } from '@nestjs/common';
import { drive_v3, google } from 'googleapis';

export interface UploadToDrivePayload {
  fileStream: ReadableStream;
  fileName: string;
  mimeType: string;
  url: string;
}

interface UploadToDriveResult {
  name: string;
  url: string;
  storage_url: string;
}

@Injectable()
export class GoogleDriveService {
  private gDrive: drive_v3.Drive;

  constructor() {
    const encodedCredentials = process.env.GOOGLE_DRIVE_CREDENTIALS || '';

    console.log('found encoded GDRIVE Credentials');

    const credentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(credentials),
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    console.log('authentication completed');

    this.gDrive = google.drive({ version: 'v3', auth });

    console.log('Gdrive inited');
  }

  async uploadManyToDrive(files: UploadToDrivePayload[]): Promise<UploadToDriveResult[]> {
    try {
      console.log('looking for the folder');
      const folderId = await this.getOrCreateFolder();
      console.log('Folder found');

      return Promise.all(files.map(
        async ({
          fileName,
          mimeType,
          fileStream
        }) => {
          console.log('Trying to upload file');
          const response = await this.gDrive.files.create({
            requestBody: {
              mimeType,
              name: fileName,
              parents: [folderId],
            },
            media: { mimeType, body: fileStream },
            uploadType: 'resumable',
          });

          console.log('Creating file permission');

          this.gDrive.permissions.create({
            fileId: String(response.data.id),
            requestBody: {
              role: 'reader',
              type: 'anyone',
            },
          });

          const fileUrl = `https://drive.google.com/uc?id=${response.data.id}`;

          return {
            id: String(response.data.id),
            name: fileName,
            url: fileUrl,
            storage_url: fileUrl
          };
        }));
    } catch (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }

  async getOrCreateFolder(): Promise<string> {
    const FOLDER_NAME = 'project_files';

    try {
      const res = await this.gDrive.files.list({
        q: `name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id, name)',
      });

      if (res.data.files?.length) {
        return res.data.files[0].id as string;
      }

      const folderMetadata = {
        name: FOLDER_NAME,
        mimeType: 'application/vnd.google-apps.folder',
      };

      const folder = await this.gDrive.files.create({
        requestBody: folderMetadata,
        fields: 'id',
      });

      if (!folder.data.id) {
        throw new Error('Failed to create folder.');
      }

      return folder.data.id;
    } catch (error) {
      throw new Error(`Error getting/creating folder: ${error.message}`);
    }
  }
}
