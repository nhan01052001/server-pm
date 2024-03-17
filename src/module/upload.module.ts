import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { entities } from '../entities.provider';
import { UploadController } from '../controller/upload.controller';
import { UploadService } from '../service/upload.service';

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    controllers: [UploadController],
    providers: [UploadService],
    exports: [UploadService]
})
export class UploadModule {}
