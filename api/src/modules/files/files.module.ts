import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileModel } from './File.model';
import { GoogleDriveService } from '../googleDrive/googleDrive.service';

@Module({
  imports: [SequelizeModule.forFeature([FileModel])],
  controllers: [FilesController],
  providers: [FilesService, GoogleDriveService],
})
export class FilesModule {}
