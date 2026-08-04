import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { ReservationEntity } from './reservation.entity';
import { FxModule } from '../fx/fx.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReservationEntity]), FxModule],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
