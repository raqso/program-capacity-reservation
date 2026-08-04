import { Injectable, NotImplementedException } from '@nestjs/common';

import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReleaseReservationDto } from './dto/release-reservation.dto';

@Injectable()
export class ReservationsService {
  async createReservation(programId: string, dto: CreateReservationDto) {
    throw new NotImplementedException('Method not implemented');
  }

  async releaseReservation(reservationId: string, dto: ReleaseReservationDto) {
    throw new NotImplementedException('Method not implemented');
  }
}
