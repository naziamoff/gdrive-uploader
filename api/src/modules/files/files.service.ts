import { Injectable } from '@nestjs/common';
import { CreateFileDTO } from './dto/createFile.dto';
import { InjectModel } from '@nestjs/sequelize';
import { FileModel } from './File.model';
import { GoogleDriveService } from '../googleDrive/googleDrive.service';
import { Op } from 'sequelize';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(FileModel) private readonly fileModel: typeof FileModel,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  async createMany(files: CreateFileDTO[]): Promise<FileModel[]> {
    const uploadedFiles = await this.googleDriveService.uploadManyToDrive(files);

    console.log('Files uploaded to drive, creating entries in DB');

    return this.fileModel.bulkCreate(
      uploadedFiles.map((file) => ({
        name: file.name,
        url: file.url,
        storage_url: file.storage_url,
    }))
    );
  }

  findAll(): Promise<any[]> {
    return this.fileModel.findAll({
      where: {
        storage_url: { [Op.ne]: null },
      },
    });
  }
}
