import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { WardsRepository } from "../repository/wards.repository";
import { wards } from "../entity/wards.entity";
import { ErrorResponse } from "../error/error-response.error";
import { FilterParamsDTO } from "../validator/dto/address-params.dto";
import { ProvincesService } from "./provinces.service";

@Injectable({})
export class WardsService {
    constructor(

        @InjectRepository(wards)
        private wardsRepository: WardsRepository,

        private provincesService: ProvincesService

    ) { }

    async getWards(headers: any, districtCode: string, search?: string): Promise<unknown> {
        const { page, pagesize, sort, typesort }: FilterParamsDTO = headers;
        try {
            let take = 1 * 20;
            let skip = take - 20;

            let data = districtCode
                ? await this.wardsRepository.createQueryBuilder('wards').where("wards.district_code = :districtCode", { districtCode })
                : await this.wardsRepository.createQueryBuilder('wards');
            let totalItem: number = await data.getCount(),
                totalPage: number = 0;

            if (search && search.length > 0) {
                data.andWhere("wards.name LIKE :search", { search: `%${search}%` });
            }

            if (page && pagesize) {
                const temp = await this.provincesService.handlePaging({ page, pagesize }, totalItem, data);
                totalPage = temp.totalPage;
                if (temp.status === 'SUCCESS') {
                    data = temp.data;
                }
            }

            const result = await data.getMany();
            if (result) {
                return {
                    status: 200,
                    statusText: 'SUCCESS',
                    message: 'Thành công!',
                    data: result,
                    totalItem,
                    totalPage
                }
            } else {
                return {
                    status: 200,
                    statusText: 'EMPTY',
                    message: 'Không có dữ liệu!',
                    data: [],
                    totalItem,
                    totalPage
                }
            }
        } catch (error) {
            throw new ErrorResponse({ ... new BadRequestException(error), errorCode: "FAIL" });
        }
    }

}