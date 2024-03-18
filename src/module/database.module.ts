import { Module, Global, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from '../orm.config';
import { createConnection } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import * as dotenv from 'dotenv';
dotenv.config();

const DatabaseProvider: Provider[] = [
  {
    provide: "MYSQL_CONNECTION",
    useFactory: () =>
      createConnection({
        connectTimeout: 60 * 60 * 1000,
        acquireTimeout: 60 * 60 * 1000,
        name: "MYSQL_CONNECTION",
        ...ormConfig,
      } as MysqlConnectionOptions)
  }
];

@Global()
@Module({
  providers: [...DatabaseProvider],
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port: typeof process.env.PORT === 'number' ? process.env.PORT : 0,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: [__dirname + '/../**/*.entity.{js,ts}'], //['./**/entities/*.entity'],
      // autoLoadEntities: true,
      synchronize: true
    })
  ],
})
export class DatabaseModule { }
