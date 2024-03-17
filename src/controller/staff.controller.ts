import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MyJwtGuard } from '../service/guard/myjwt.guard';
import { Staff } from '../entity/staff.entity';
import { StaffService } from '../service/staff.service';

@Controller('staff')
export class StaffController {
    constructor(private readonly staffService: StaffService) {

    }

    @UseGuards(MyJwtGuard)
    @Get('getAllStaff')
    getAll(): Promise<unknown> {
        return this.staffService.getAll();
    }

    @UseGuards(MyJwtGuard)
    @Get('getStaffById/:id')
    getUserByID(@Param() param: any): Promise<Staff> {
        return this.staffService.getStaffByID(param?.id);
    }
}
