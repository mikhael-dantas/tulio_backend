import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'mysql',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'test',
  entities: [User],
  synchronize: true,
  migrations: ['src/migrations/*.ts'],
};
