import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres_password',
  database: process.env.POSTGRES_NAME || 'reservation_db',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/common/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
