import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const ormConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'sapassword',
    database: 'pharmacymanager_product',
    entities: [__dirname + '/entity/*.entity.{js,ts}'], //['./**/entities/*.entity'],
    // autoLoadEntities: true,
    synchronize: false,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    //   cli: {
    //     migrationsDir: 'src/database/migrations',
    //   },
}

export default ormConfig;