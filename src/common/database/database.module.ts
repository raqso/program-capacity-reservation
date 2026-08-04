import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppDataSource } from './data-source';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...AppDataSource.options,
        autoLoadEntities: true,
        migrationsRun: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
