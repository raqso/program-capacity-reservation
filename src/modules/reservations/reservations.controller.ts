import {
  Controller,
  Post,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post('programs/:programId/reservations')
  @HttpCode(HttpStatus.CREATED)
  async createReservation(
    @Param('programId') programId: string,
    @Body() dto: CreateReservationDto,
  ) {
    return await this.reservationsService.createReservation(programId, dto);
  }

  @Post('reservations/:reservationId/release')
  @HttpCode(HttpStatus.OK)
  async releaseReservation(@Param('reservationId') reservationId: string) {
    return await this.reservationsService.releaseReservation(reservationId);
  }
}
