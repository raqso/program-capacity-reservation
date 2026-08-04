import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';

import { ProgramsService } from './programs.service';
import { GetCapacityQueryDto } from './dto/get-capacity-query.dto';

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get(':programId/capacity')
  @HttpCode(HttpStatus.OK)
  async getCapacity(
    @Param('programId') programId: string,
    @Query() query: GetCapacityQueryDto,
  ) {
    return this.programsService.getCapacity(programId, query.currency);
  }
}
