import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { DistrictsRepository } from "../repository/districts.repository";
import { districts } from "../entity/districts.entity";
import { ErrorResponse } from "../error/error-response.error";
import { FilterParamsDTO } from "../validator/dto/Address-params.dto";
import { ProvincesService } from "./provinces.service";

@Injectable({})
export class DistrictsService {
    constructor(

        @InjectRepository(districts)
        private districtsRepository: DistrictsRepository,

        private provincesService: ProvincesService

    ) { }

    async getDistricts(headers: any, provinceCode: string, search?: string): Promise<unknown> {
        const { page, pagesize, sort, typesort }: FilterParamsDTO = headers;
        try {
            let take = 1 * 20;
            let skip = take - 20;

            let data = provinceCode
                ? await this.districtsRepository.createQueryBuilder('districts').where("districts.province_code = :provinceCode", { provinceCode })
                : await this.districtsRepository.createQueryBuilder('districts');
            let totalItem: number = await data.getCount(),
                totalPage: number = 0;

            if (search && search.length > 0) {
                data.andWhere("districts.name LIKE :search", { search: `%${search}%` });
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

    async getDistrictsByCode(code: string): Promise<unknown> {

        try {
            const data = await this.districtsRepository.createQueryBuilder('districts');

            data.where("districts.code = :code", { code });

            const result = await data.getOne();
            if (result) {
                return {
                    status: 200,
                    statusText: 'SUCCESS',
                    message: 'Thành công!',
                    data: result,
                }
            } else {
                return {
                    status: 200,
                    statusText: 'EMPTY',
                    message: 'Không có dữ liệu!',
                    data: {}
                }
            }
        } catch (error) {
            throw new ErrorResponse({ ... new BadRequestException(error), errorCode: "FAIL" });
        }
    }
}