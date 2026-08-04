import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { ReservationEntity } from './reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReservationEntity])],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
