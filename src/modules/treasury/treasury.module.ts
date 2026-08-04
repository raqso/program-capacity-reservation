import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TreasuryController } from './treasury.controller';
import { ProcessedEventEntity } from './processed-events.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProcessedEventEntity])],
  controllers: [TreasuryController],
})
export class TreasuryModule {}
