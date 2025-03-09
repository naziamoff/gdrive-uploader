import { Injectable } from '@nestjs/common';
import { CreateFileDTO } from './dto/createFile.dto';
import { InjectModel } from '@nestjs/sequelize';
import { FileModel } from './File.model';
import axios from 'axios';
import { GoogleDriveService, UploadToDrivePayload } from '../googleDrive/googleDrive.service';
import { Op } from 'sequelize';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(FileModel) private readonly fileModel: typeof FileModel,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  async createMany(files: CreateFileDTO[]): Promise<FileModel[]> {
    console.log('Starting to fetch files');
    const filesPayload = await Promise.all(
      files.map(({ name, url }) => this.fetchFile(url, name))
    );
    console.log('Files fetched, uploading to drive');

    const uploadedFiles = await this.googleDriveService.uploadManyToDrive(filesPayload);

    console.log('Files uploaded to drive, creating entries in DB');

    return this.fileModel.bulkCreate(
      uploadedFiles.map((file) => ({
        name: file.name,
        url: file.url,
        storage_url: file.storage_url,
    }))
    );
  }

  private async fetchFile(url: string, name: string): Promise<UploadToDrivePayload> {
    try {
      const response = await axios.get(
        url,
        { responseType: 'stream' }
      );

      console.log('fetch completed, response received');

      return {
        fileStream: response.data as ReadableStream,
        mimeType: response.headers['content-type'],
        fileName: name,
        url,
      };
    } catch (error) {
      throw new Error(`Error while fetching file ${name}. ${error.message}`);
    }
  }

  findAll(): Promise<any[]> {
    return this.fileModel.findAll({
      where: {
        storage_url: { [Op.ne]: null },
      },
    });
  }
}
