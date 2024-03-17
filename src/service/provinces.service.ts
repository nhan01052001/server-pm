import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { ProvincesRepository } from "../repository/provinces.repository";
import { provinces } from "../entity/provinces.entity";
import { ErrorResponse } from "../error/error-response.error";
import { FilterParamsDTO } from "../validator/dto/address-params.dto";
import { SelectQueryBuilder } from "typeorm";
import { entities } from "../entities.provider";

@Injectable({})
export class ProvincesService {
    constructor(

        @InjectRepository(provinces)
        private provincesRepository: ProvincesRepository,

    ) { }

    async getProvinces(headers: any, search?: string): Promise<unknown> {
        let { page, pagesize, sort, typesort }: FilterParamsDTO = headers;
        try {
            let take = 1 * 20;
            let skip = take - 20;

            let data = await this.provincesRepository.createQueryBuilder('provinces');
            let totalItem: number = await data.getCount(),
                totalPage: number = 0;

            if (search && search.length > 0) {
                data.where("provinces.name LIKE :search", { search: `%${search}%` });
            }

            if ((page && pagesize) || ((sort as boolean) && typesort)) {
                const temp = await this.handlePaging({ page, pagesize, sort, typesort }, totalItem, data, 'provinces', 'name');
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

    async getProvincesByCode(code: string): Promise<unknown> {

        try {
            const data = await this.provincesRepository.createQueryBuilder('provinces');

            data.where("provinces.code = :code", { code });

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

    handlePaging = async ({ page, pagesize, sort, typesort }: FilterParamsDTO, totalItem: number, data: SelectQueryBuilder<any>, tableName?: string, fieldSort?: string): Promise<{ status: string; data: SelectQueryBuilder<any>; totalPage: number; }> => {

        // sort
        if ((tableName && tableName.length > 0) && (sort as boolean) && (typesort && typesort.length > 0) && (fieldSort && fieldSort.length > 0)) {
            data.orderBy(`${tableName}.${fieldSort}`, `${typesort}`)
        }

        let resultNumberItem: number = await data.getCount();

        // default take 20 and skip 0;
        let take = 20;
        let skip = 0;
        let totalPage = 1;

        if (page && pagesize && !isNaN(Number(page)) && !isNaN(Number(pagesize))) {
            let pageReattached = Number(page),
                pageSizeReattached = Number(pagesize);
            if (pageReattached >= 1 && pageSizeReattached >= 1) {
                if (resultNumberItem) {
                    totalPage = Math.ceil(resultNumberItem / pageSizeReattached);
                    if (totalPage < pageReattached) {
                        return {
                            status: 'ERROR',
                            data: null,
                            totalPage
                        }
                    }
                }

                take = pageSizeReattached;
                skip = (pageReattached * take) - take;
            }
        }

        return {
            status: 'SUCCESS',
            data: data.take(take).skip(skip),
            totalPage
        }
    }
}