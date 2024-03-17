import { Controller, Post, Req, Body, Get, Param, Headers, Query } from "@nestjs/common";

import { WardsService } from "../service/wards.service";

@Controller('wards')
export class WardsController {
    constructor(
        private wardsService: WardsService
    ){}

    @Get('/getWards/')
    getWards(@Headers() headers: any, @Query("districtCode") districtCode: string, @Query("search") search?: string): Promise<unknown> {
        return this.wardsService.getWards(headers, districtCode, search);
    }

}