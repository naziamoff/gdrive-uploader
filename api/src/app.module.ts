import { Module } from '@nestjs/common';
import { FilesController } from './modules/files/files.controller';
import { FilesService } from './modules/files/files.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileModel } from './modules/files/File.model';
import { GoogleDriveService } from './modules/googleDrive/googleDrive.service';
import { parse } from 'pg-connection-string';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        if (databaseUrl) {
          const dbConfig = parse(databaseUrl);
          console.log(dbConfig);

          return {
            dialect: 'postgres',
            host: dbConfig.host as string,
            port: Number(dbConfig.port),
            username: dbConfig.user,
            password: dbConfig.password,
            database: String(dbConfig.database),
            models: [FileModel],
            autoLoadModels: true,
            synchronize: true,
            dialectOptions: {
              ssl: {
                rejectUnauthorized: false,
                require: true,
              },
            },
            logging: console.log
          };
        }

        return ({
          dialect: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USER'),
          password: String(configService.get<string>('DB_PASSWORD')),
          database: configService.get<string>('DB_NAME'),
          models: [FileModel],
          autoLoadModels: true,
          synchronize: true,
        });
      },
    }),
    SequelizeModule.forFeature([FileModel]),
  ],
  controllers: [FilesController],
  providers: [FilesService, GoogleDriveService],
  exports: [],
})
export class AppModule {}
