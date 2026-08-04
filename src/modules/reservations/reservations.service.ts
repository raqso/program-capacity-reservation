import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationEntity, ReservationStatus } from './reservation.entity';
import { ProgramEntity } from '../programs/programs.entity';
import { FxService } from '../fx/fx.service';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly fxService: FxService,
  ) {}

  async createReservation(programId: string, dto: CreateReservationDto) {
    return this.dataSource.transaction(async (manager) => {
      const existingReservation = await manager.findOne(ReservationEntity, {
        where: { invoiceId: dto.invoiceId },
      });

      if (existingReservation) {
        return existingReservation;
      }

      const program = await manager.findOne(ProgramEntity, {
        where: { id: programId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!program) {
        throw new NotFoundException('Program not found');
      }

      const amountToReserve = await this.fxService.convert(
        dto.amount,
        dto.currency,
        program.currency,
      );

      const activeSum = await manager.sum(
        ReservationEntity,
        'reservedAmountInProgramCurrency',
        {
          programId,
          status: ReservationStatus.ACTIVE,
        },
      );
      const currentReserved = activeSum ?? 0;
      if (program.totalCapacity - currentReserved < amountToReserve) {
        throw new BadRequestException('Insufficient capacity');
      }

      const reservation = manager.create(ReservationEntity, {
        programId,
        invoiceId: dto.invoiceId,
        originalAmount: dto.amount,
        originalCurrency: dto.currency,
        reservedAmountInProgramCurrency: amountToReserve,
        status: ReservationStatus.ACTIVE,
      });

      return manager.save(ReservationEntity, reservation);
    });
  }

  async releaseReservation(reservationId: string) {
    return this.dataSource.transaction(async (manager) => {
      const reservation = await manager.findOne(ReservationEntity, {
        where: { id: reservationId },
      });

      if (!reservation) {
        throw new NotFoundException();
      }

      if (reservation.status === ReservationStatus.RELEASED) {
        return reservation;
      }

      reservation.status = ReservationStatus.RELEASED;

      return manager.save(ReservationEntity, reservation);
    });
  }
}
