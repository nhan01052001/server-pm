import { Module, Global, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from '../orm.config';
import { createConnection } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const DatabaseProvider: Provider[] = [
    {
      provide: "MYSQL_CONNECTION",
      useFactory: () =>
        createConnection({
          name: "MYSQL_CONNECTION",
          ...ormConfig
        } as MysqlConnectionOptions )
    }
  ];

@Global()
@Module({
    providers: [...DatabaseProvider],
    imports:[
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'sapassword',
            database: 'pharmacymanager_product',
            entities:  [__dirname + '/../**/*.entity.{js,ts}'], //['./**/entities/*.entity'],
            // autoLoadEntities: true,
            synchronize: true
        })
    ],
})
export class DatabaseModule {}
