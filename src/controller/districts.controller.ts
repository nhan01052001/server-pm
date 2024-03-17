import { Controller, Post, Req, Body, Get, Param, Headers, Query } from "@nestjs/common";

import { DistrictsService } from "../service/districts.service";

@Controller('districts')
export class DistrictsController {
    constructor(
        private districtsService: DistrictsService
    ){}

    @Get('/getDistricts/')
    getDistricts(@Headers() headers: any, @Query("provinceCode") provinceCode: string, @Query("search") search?: string): Promise<unknown> {
        return this.districtsService.getDistricts(headers, provinceCode, search);
    }

    @Get('/getDistrictsByCode/:code')
    getDistrictsByCode(@Param('code') code: string): Promise<unknown> {
        return this.districtsService.getDistrictsByCode(code);
    }

}