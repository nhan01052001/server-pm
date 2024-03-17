import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../entities.provider';
import { AuthModule } from './auth.module';
import {StaffController} from '../controller/staff.controller'
import { StaffService } from '../service/staff.service';

@Module({
    imports: [TypeOrmModule.forFeature(entities), AuthModule],
    controllers: [StaffController],
    providers: [StaffService],
    exports: [StaffService]
})
export class StaffModule {}
