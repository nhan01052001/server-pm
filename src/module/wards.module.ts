import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { entities } from "../entities.provider";
import { WardsService } from '../service/wards.service';
import { WardsController } from '../controller/wards.controller';
import { ProvincesService } from '../service/provinces.service';

@Module({
    imports: [JwtModule.register({}), TypeOrmModule.forFeature(entities)],
    controllers: [
        WardsController
    ],
    providers: [
        WardsService,
        ProvincesService,
    ],
    exports: [WardsService]
})
export class WardsModule {}
