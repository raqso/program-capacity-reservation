import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProgramEntity } from './programs.entity';
import {
  ReservationEntity,
  ReservationStatus,
} from '../reservations/reservation.entity';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(ProgramEntity)
    private readonly programsRepository: Repository<ProgramEntity>,
    @InjectRepository(ReservationEntity)
    private readonly reservationsRepository: Repository<ReservationEntity>,
  ) {}

  async getCapacity(programId: string) {
    const program = await this.programsRepository.findOne({
      where: { id: programId },
    });

    if (!program) {
      throw new NotFoundException(`Program with ID ${programId} not found`);
    }

    const activeSum = await this.reservationsRepository.sum(
      'reservedAmountInProgramCurrency',
      {
        programId,
        status: ReservationStatus.ACTIVE,
      },
    );

    const reservedCapacity = activeSum ?? 0;
    let availableCapacity = Math.max(
      0,
      program.totalCapacity - reservedCapacity,
    );

    return {
      id: program.id,
      capacity: {
        available: availableCapacity,
        reserved: reservedCapacity,
        total: program.totalCapacity,
        currency: program.currency,
      },
    };
  }

  async updateCapacity(programId: string, capacity: number) {
    const program = await this.programsRepository.findOne({
      where: { id: programId },
    });

    if (!program) {
      throw new NotFoundException(`Program with ID ${programId} not found`);
    }

    program.totalCapacity = capacity;

    return this.programsRepository.save(program);
  }
}
