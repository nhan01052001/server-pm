import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from '../entity/staff.entity';
import { ErrorResponse } from '../error/error-response.error';
import { StaffRepository } from '../repository/staff.repository';
import { ILike } from 'typeorm';

@Injectable()
export class StaffService {
    constructor(
        @InjectRepository(Staff)
        private readonly staffRepository: StaffRepository,

    ){}

    async getAll(): Promise<unknown> {
        return await this.staffRepository.find();
    }

    async getStaffByUsername(username: string): Promise<Staff> {
        return await this.staffRepository.findOne({ where: {username: ILike(username), isDeleted: false} });
    }

    async getStaffByID(id: string): Promise<Staff> {
        if(id) {
            const Staff = await this.staffRepository.findOne({ where: {id: ILike(id), isDeleted: false} });
            delete Staff.password;
            return Staff;
        } else {
            throw new ErrorResponse({ ...new BadRequestException('NOT FOUND Staff'), errorCode: "NOT_FOUND" });
        }
    }

}
