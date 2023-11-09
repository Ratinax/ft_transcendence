import { TypeOrmModuleOptions } from "@nestjs/typeorm";

/**
 * config to connect to database
 *
 */
export const typeOrmConfig : TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'postgres',
    port: +process.env.DB_PORT,
    username: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_NAME}`,
    synchronize: true,
  };
