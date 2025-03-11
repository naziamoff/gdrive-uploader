import { Injectable } from '@nestjs/common';
import { CreateFileDTO } from './dto/createFile.dto';
import { InjectModel } from '@nestjs/sequelize';
import { FileModel } from './File.model';
import { GoogleDriveService } from '../googleDrive/googleDrive.service';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(FileModel) private readonly fileModel: typeof FileModel,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  async createMany(files: CreateFileDTO[]): Promise<FileModel[]> {
    const uploadedFiles = await this.googleDriveService.uploadManyToDrive(files);

    return this.fileModel.bulkCreate(
      uploadedFiles.map((file) => ({
        name: file.name,
        url: file.url,
        storage_url: file.storage_url,
    }))
    );
  }

  findAll(): Promise<FileModel[]> {
    return this.fileModel.findAll();
  }
}
