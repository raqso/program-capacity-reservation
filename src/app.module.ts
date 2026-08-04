import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { ApiKeyAuthGuard } from './common/guards/api-key-auth.guard';
import { ProgramsModule } from './modules/programs/programs.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { DatabaseModule } from './common/database/database.module';
import { TreasuryModule } from './modules/treasury/treasury.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProgramsModule,
    ReservationsModule,
    DatabaseModule,
    TreasuryModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyAuthGuard,
    },
  ],
})
export class AppModule {}
