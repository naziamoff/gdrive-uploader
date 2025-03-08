import { Module } from '@nestjs/common';
import { FilesController } from './modules/files/files.controller';
import { FilesService } from './modules/files/files.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileModel } from './modules/files/File.model';
import { GoogleDriveService } from './modules/googleDrive/googleDrive.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        console.log(`DATABASE_URL: ${databaseUrl}`);

        if (databaseUrl) {
          return {
            dialect: 'postgres',
            url: databaseUrl,
            models: [FileModel],
            autoLoadModels: true,
            synchronize: true,
          };
        }

        throw new Error('DATABASE_URL not found');

        // return ({
        //   dialect: 'postgres',
        //   host: configService.get<string>('DB_HOST'),
        //   port: configService.get<number>('DB_PORT'),
        //   username: configService.get<string>('DB_USER'),
        //   password: String(configService.get<string>('DB_PASSWORD')),
        //   database: configService.get<string>('DB_NAME'),
        //   models: [FileModel],
        //   autoLoadModels: true,
        //   synchronize: true,
        // });
      },
    }),
    SequelizeModule.forFeature([FileModel]),
  ],
  controllers: [FilesController],
  providers: [FilesService, GoogleDriveService],
  exports: [],
})
export class AppModule {}
