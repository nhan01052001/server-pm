import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../entities.provider';
import { BillController } from '../controller/bill.controller';
import { BillService } from '../service/bill.service';
import { AuthModule } from './auth.module';
import { MedicinesService } from '../service/medicine.service';
import { ProvincesService } from '../service/provinces.service';
import { UserService } from '../service/user.service';
import { MedicineModule } from './medicine.module';
import { CartService } from '../service/cart.service';

@Module({
    imports: [TypeOrmModule.forFeature(entities), AuthModule],
    controllers: [BillController],
    providers: [BillService, MedicinesService, ProvincesService, UserService, CartService],
    exports: [BillService]
})
export class BillModule {}
