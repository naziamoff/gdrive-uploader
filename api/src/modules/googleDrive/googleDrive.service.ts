import { Injectable } from '@nestjs/common';
import { drive_v3, google } from 'googleapis';
import axios from "axios";
import { CreateFileDTO } from "../files/dto/createFile.dto";
import { UploadToDriveResult } from "./interfaces/UploadToDriveResult";

@Injectable()
export class GoogleDriveService {
  private gDrive: drive_v3.Drive;

  private folderIdCache: string | null = null;

  private axiosInstance = axios.create({
    httpAgent: { keepAlive: true, maxSockets: 25 },
  });

  constructor() {
    const encodedCredentials = process.env.GOOGLE_DRIVE_CREDENTIALS || '';

    const credentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(credentials),
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    this.gDrive = google.drive({ version: 'v3', auth });
  }

  async uploadManyToDrive(files: CreateFileDTO[]): Promise<UploadToDriveResult[]> {
    try {
      const folderId = this.folderIdCache ?? await this.getOrCreateFolder();

      const uploadedFiles = await Promise.all(files.map(
        (file) => this.uploadSingleFile(file, folderId)),
      );

      await this.updateFilePermissions(uploadedFiles);

      return uploadedFiles;
    } catch (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }

  private async uploadSingleFile(
    { url, name }: CreateFileDTO,
    folderId: string
  ) {
    const fetchResult = await this.axiosInstance.get(
      url,
      { responseType: 'stream' }
    );

    const mimeType = fetchResult.headers['content-type'];

    const response = await this.gDrive.files.create({
      requestBody: {
        mimeType,
        name,
        parents: [folderId],
      },
      media: { mimeType, body: fetchResult.data },
      uploadType: 'resumable',
      fields: 'id'
    });

    const storage_url = `https://drive.google.com/uc?id=${response.data.id}`;

    return {
      id: String(response.data.id),
      storage_url,
      name,
      url
    };
  }

  private async getOrCreateFolder(): Promise<string> {
    const FOLDER_NAME = 'project_files';

    const res = await this.gDrive.files.list({
      q: `name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
    });

    if (res.data.files?.length) {
      return res.data.files[0].id as string;
    }

    const folder = await this.gDrive.files.create({
      fields: 'id',
      requestBody: {
        name: FOLDER_NAME,
        mimeType: 'application/vnd.google-apps.folder',
      },
    });

    if (!folder.data.id) {
      throw new Error('Failed to create folder.');
    }

    return folder.data.id;
  }

  private async updateFilePermissions(files: UploadToDriveResult[]): Promise<void> {
    await Promise.all(
      files.map((file) => (
        this.gDrive.permissions.create({
          fileId: String(file.id),
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
        })
      )))
  }
}
