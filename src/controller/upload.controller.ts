import { Controller, Post, Req, Body, Get, Param, Headers, Query, Res, UseInterceptors, UploadedFiles } from "@nestjs/common";
import { AnyFilesInterceptor, FileInterceptor } from "@nestjs/platform-express";
import * as multer from "multer";
import { extname } from 'path'

import { UploadService } from "../service/upload.service";

@Controller('upload')
export class UploadController {
    constructor(
        private uploadService: UploadService
    ){}

    @Post('/image')
    @UseInterceptors(AnyFilesInterceptor({
        storage: multer.memoryStorage()
      }))
    uploadImage(@UploadedFiles() file: Express.Multer.File): Promise<unknown> {
        return this.uploadService.uploadImage(file);
    }

}