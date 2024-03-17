import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const ormConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.HOST,
    port: typeof process.env.PORT === 'number' ? process.env.PORT : 0,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    entities: [__dirname + '/entity/*.entity.{js,ts}'], //['./**/entities/*.entity'],
    // autoLoadEntities: true,
    synchronize: false,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    //   cli: {
    //     migrationsDir: 'src/database/migrations',
    //   },
}

export default ormConfig;