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

  async releaseReservation(invoiceId: string) {
    return this.dataSource.transaction(async (manager) => {
      const reservation = await manager.findOne(ReservationEntity, {
        where: { invoiceId },
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

  async reconcileProgram(
    programId: string,
    expectedActiveInvoices: Array<{
      invoiceId: string;
      amount: number;
      currency: string;
    }>,
    newTotalCapacity?: number,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const program = await manager.findOneOrFail(ProgramEntity, {
        where: { id: programId },
      });

      if (newTotalCapacity !== undefined) {
        await manager.update(
          ProgramEntity,
          { id: programId },
          { totalCapacity: newTotalCapacity },
        );
      }

      const localActiveReservations = await manager.find(ReservationEntity, {
        where: {
          programId,
          status: ReservationStatus.ACTIVE,
        },
      });

      const expectedInvoiceIds = new Set(
        expectedActiveInvoices.map((activeInvoice) => activeInvoice.invoiceId),
      );
      const localActiveMap = new Map(
        localActiveReservations.map((reservation) => [
          reservation.invoiceId,
          reservation,
        ]),
      );

      for (const localReservation of localActiveReservations) {
        if (!expectedInvoiceIds.has(localReservation.invoiceId)) {
          localReservation.status = ReservationStatus.RELEASED;
          await manager.save(ReservationEntity, localReservation);
        }
      }

      for (const expectedInvoice of expectedActiveInvoices) {
        if (!localActiveMap.has(expectedInvoice.invoiceId)) {
          const existingReservation = await manager.findOne(ReservationEntity, {
            where: { invoiceId: expectedInvoice.invoiceId },
          });

          if (!existingReservation) {
            const amountToReserve = await this.fxService.convert(
              expectedInvoice.amount,
              expectedInvoice.currency,
              program.currency,
            );

            const newReservation = manager.create(ReservationEntity, {
              programId,
              invoiceId: expectedInvoice.invoiceId,
              originalAmount: expectedInvoice.amount,
              originalCurrency: expectedInvoice.currency,
              reservedAmountInProgramCurrency: amountToReserve,
              status: ReservationStatus.ACTIVE,
            });

            await manager.save(ReservationEntity, newReservation);
          }
        }
      }
    });
  }
}
