import { TypeOrmModuleOptions } from '@nestjs/typeorm';
require('dotenv').config();

const databaseConfig: TypeOrmModuleOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "thapa123",
    database: "chat",
    synchronize: true,
    logging: false,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
};

export default databaseConfig;  