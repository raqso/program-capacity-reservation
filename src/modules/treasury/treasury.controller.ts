import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TreasuryKafkaTopics } from './events';
import type {
  CapacityUpdatedPayload,
  ReconciliationRequestedPayload,
} from './events';
import { ProcessedEventEntity } from './processed-events.entity';

@Controller()
export class TreasuryController {
  constructor(
    @InjectRepository(ProcessedEventEntity)
    private readonly processedEventsRepository: Repository<ProcessedEventEntity>,
  ) {}

  @EventPattern(TreasuryKafkaTopics.CAPACITY_UPDATED)
  async handleCapacityUpdated(
    @Payload() message: CapacityUpdatedPayload,
    @Ctx() context: KafkaContext,
  ): Promise<void> {
    const messageId = this.getMessageId(context);

    const isNew = await this.markProcessed(messageId);
    if (!isNew) {
      console.log(`[${messageId}] Duplicate delivery, skipping`);
      return;
    }

    console.log(
      `[${messageId}] Processed capacity update for ${message.programId}`,
    );
    console.log(
      `New total capacity: ${message.totalCapacity} ${message.currency}`,
    );

    // TODO:
  }

  @EventPattern(TreasuryKafkaTopics.RECONCILIATION_REQUESTED)
  async handleReconciliation(
    @Payload() message: ReconciliationRequestedPayload,
    @Ctx() context: KafkaContext,
  ): Promise<void> {
    const messageId = this.getMessageId(context);

    const isNew = await this.markProcessed(messageId);
    if (!isNew) {
      console.log(`[${messageId}] Duplicate delivery, skipping`);
      return;
    }

    console.log(`[${messageId}] Reconciling program ${message.programId}`);

    // TODO:
  }

  private async markProcessed(messageId: string): Promise<boolean> {
    const result = await this.processedEventsRepository
      .createQueryBuilder()
      .insert()
      .into(ProcessedEventEntity)
      .values({ messageId })
      .orIgnore()
      .execute();

    return result.identifiers.length > 0;
  }

  private getMessageId(context: KafkaContext) {
    const topic = context.getTopic();
    const partition = context.getPartition();
    const { offset } = context.getArgs()[0];

    return `${topic}-${partition}-${offset}`;
  }
}
