import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';

import { ProgramsService } from './programs.service';

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get(':programId/capacity')
  @HttpCode(HttpStatus.OK)
  async getCapacity(@Param('programId') programId: string) {
    return this.programsService.getCapacity(programId);
  }
}
