import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProgramsController } from './programs.controller';
import { ProgramsService } from './programs.service';
import { ProgramEntity } from './programs.entity';
import { ReservationEntity } from '../reservations/reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProgramEntity, ReservationEntity])],
  controllers: [ProgramsController],
  providers: [ProgramsService],
  exports: [ProgramsService],
})
export class ProgramsModule {}
