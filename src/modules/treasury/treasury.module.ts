import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TreasuryController } from './treasury.controller';
import { ProcessedEventEntity } from './processed-events.entity';
import { ProgramsModule } from '../programs/programs.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProcessedEventEntity]), ProgramsModule],
  controllers: [TreasuryController],
})
export class TreasuryModule {}
