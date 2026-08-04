import path from 'node:path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppDataSource } from './data-source';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        ...AppDataSource.options,
        entities: [path.join(__dirname, '**/*.entity{.ts,.js}')],
        migrations: [
          path.join(__dirname, 'common/database/migrations/*{.ts,.js}'),
        ],
        autoLoadEntities: true,
        migrationsRun: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
