import { Controller, Post, Req, Body, Get, Param, Headers, Query } from "@nestjs/common";

import { ProvincesService } from "../service/provinces.service";

@Controller('provinces')
export class ProvincesController {
    constructor(
        private provincesService: ProvincesService
    ) { }

    @Get('/getProvinces/')
    getProvinces(@Headers() headers: any, @Query("search") search?: string): Promise<unknown> {
        return this.provincesService.getProvinces(headers, search);
    }

    @Get('/getProvincesByCode/:code')
    getProvincesByCode(@Param('code') code: string): Promise<unknown> {
        return this.provincesService.getProvincesByCode(code);
    }

}