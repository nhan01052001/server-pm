import { Module } from "@nestjs/common";
import { ProvincesController } from "../controller/provinces.controller";
import { ProvincesService } from "../service/provinces.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { entities } from "../entities.provider";

@Module({
    imports: [JwtModule.register({}), TypeOrmModule.forFeature(entities)],
    controllers: [
        ProvincesController
    ],
    providers: [
        ProvincesService,
    ],
    exports: [ProvincesService]
})

export class ProvincesModule {}