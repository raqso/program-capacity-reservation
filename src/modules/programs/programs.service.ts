import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class ProgramsService {
  getCapacity(programId: string, requestedCurrency?: string) {
    throw new NotImplementedException('Method not implemented');
  }
}
