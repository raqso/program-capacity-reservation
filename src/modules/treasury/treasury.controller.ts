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
  InvoiceReleasedPayload,
  InvoiceReservedPayload,
  ReconciliationRequestedPayload,
} from './events';
import { ProcessedEventEntity } from './processed-events.entity';
import { ProgramsService } from '../programs/programs.service';
import { ReservationsService } from '../reservations/reservations.service';

@Controller()
export class TreasuryController {
  constructor(
    @InjectRepository(ProcessedEventEntity)
    private readonly processedEventsRepository: Repository<ProcessedEventEntity>,
    private readonly programsService: ProgramsService,
    private readonly reservationsService: ReservationsService,
  ) {}

  @EventPattern(TreasuryKafkaTopics.CAPACITY_UPDATED)
  async handleCapacityUpdated(
    @Payload() message: CapacityUpdatedPayload,
    @Ctx() context: KafkaContext,
  ): Promise<void> {
    const isNew = await this.markProcessed(context);
    if (!isNew) {
      return;
    }

    await this.programsService.updateCapacity(
      message.programId,
      message.totalCapacity,
    );
  }

  @EventPattern(TreasuryKafkaTopics.INVOICE_RESERVED)
  async handleInvoiceReserved(
    @Payload() message: InvoiceReservedPayload,
    @Ctx() context: KafkaContext,
  ) {
    const isNew = await this.markProcessed(context);
    if (!isNew) {
      return;
    }

    const { programId, amount, currency, invoiceId } = message;

    return this.reservationsService.createReservation(programId, {
      invoiceId,
      amount,
      currency,
    });
  }

  @EventPattern(TreasuryKafkaTopics.INVOICE_RELEASED)
  async handleInvoiceReleased(
    @Payload() message: InvoiceReleasedPayload,
    @Ctx() context: KafkaContext,
  ) {
    const isNew = await this.markProcessed(context);
    if (!isNew) {
      return;
    }

    return this.reservationsService.releaseReservation(message.invoiceId);
  }

  @EventPattern(TreasuryKafkaTopics.RECONCILIATION_REQUESTED)
  async handleReconciliation(
    @Payload() message: ReconciliationRequestedPayload,
    @Ctx() context: KafkaContext,
  ): Promise<void> {
    const isNew = await this.markProcessed(context);
    if (!isNew) {
      return;
    }

    await this.reservationsService.reconcileProgram(
      message.programId,
      message.activeInvoices,
      message.totalCapacity,
    );
  }

  private async markProcessed(context: KafkaContext): Promise<boolean> {
    const messageId = this.getMessageId(context);
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
