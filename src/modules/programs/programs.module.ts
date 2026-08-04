import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProgramsController } from './programs.controller';
import { ProgramsService } from './programs.service';
import { ProgramEntity } from './programs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProgramEntity])],
  controllers: [ProgramsController],
  providers: [ProgramsService],
  exports: [ProgramsService],
})
export class ProgramsModule {}
