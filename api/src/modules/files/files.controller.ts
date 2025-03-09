import { Body, Controller, Get, Post } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDTO } from './dto/createFile.dto';
import { File } from './interfaces/file.interface';
import { FileModel } from './File.model';

@Controller('/files')
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @Post()
  create(@Body() createFileDTO: CreateFileDTO[]): Promise<FileModel[]> {
    return this.fileService.createMany(createFileDTO);
  }

  @Get()
  findAll(): Promise<File[]> {
    return this.fileService.findAll();
  }
}
