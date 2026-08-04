import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProgramEntity } from './programs.entity';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(ProgramEntity)
    private readonly programsRepository: Repository<ProgramEntity>,
  ) {}

  async getCapacity(programId: string, requestedCurrency?: string) {
    const program = await this.programsRepository.findOneByOrFail({
      id: programId,
    });

    // @TODO Implement real capacity checking with reservations
    return {
      id: program.id,
      capacity: program.totalCapacity,
      currency: program.currency,
    };
  }

  async updateCapacity(programId: string, capacity: number) {
    const program = await this.programsRepository.findOneByOrFail({
      id: programId,
    });

    program.totalCapacity = capacity;

    return this.programsRepository.save(program);
  }
}
