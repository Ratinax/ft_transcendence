import { TypeOrmModuleOptions } from "@nestjs/typeorm";

/**
 * config to connect to database
 * 
 */
export const typeOrmConfig : TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'ft_database',
    synchronize: true,
  };