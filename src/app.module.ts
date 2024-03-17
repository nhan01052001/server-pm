import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppMiddleware } from './middleware/app.middleware';
import { AuthModule } from './module/auth.module';
import { DatabaseModule } from './module/database.module';
import { entities } from './entities.provider';
import { UserModule } from './module/user.module';
import { StaffModule } from './module/staff.module';
import { ProvincesModule } from './module/provinces.module'; 
import { DistrictsModule } from './module/districts.module';
import { WardsModule } from './module/wards.module';
import { MedicineModule } from './module/medicine.module';
import { UploadModule } from './module/upload.module';
import { CartModule } from './module/cart.module';
import { BillModule } from './module/bill.module';

@Module({
  imports: [
    // read file .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    StaffModule,
    ProvincesModule,
    DistrictsModule,
    WardsModule,
    MedicineModule,
    UploadModule,
    CartModule,
    BillModule,
    TypeOrmModule.forFeature(entities),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AppMiddleware)
      .forRoutes('*');
  }
}
