import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { entities } from "../entities.provider";
import { DistrictsService } from '../service/districts.service';
import { DistrictsController } from '../controller/districts.controller';
import { ProvincesService } from '../service/provinces.service';

@Module({
    imports: [JwtModule.register({}), TypeOrmModule.forFeature(entities)],
    controllers: [
        DistrictsController
    ],
    providers: [
        DistrictsService,
        ProvincesService,
    ],
    exports: [DistrictsService]
})
export class DistrictsModule {}
