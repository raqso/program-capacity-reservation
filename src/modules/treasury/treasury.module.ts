import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TreasuryController } from './treasury.controller';
import { ProcessedEventEntity } from './processed-events.entity';
import { ProgramsModule } from '../programs/programs.module';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProcessedEventEntity]),
    ProgramsModule,
    ReservationsModule,
  ],
  controllers: [TreasuryController],
})
export class TreasuryModule {}
