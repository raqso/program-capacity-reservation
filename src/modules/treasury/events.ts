const TOPIC_PREFIX = 'treasury';

export const TreasuryKafkaTopics = {
  CAPACITY_UPDATED: `${TOPIC_PREFIX}.capacity.updated`,
  INVOICE_RESERVED: `${TOPIC_PREFIX}.invoice.reserved`,
  INVOICE_RELEASED: `${TOPIC_PREFIX}.invoice.released`,
  RECONCILIATION_REQUESTED: `${TOPIC_PREFIX}.reconciliation.requested`,
} as const;

export type TreasuryKafkaTopic =
  (typeof TreasuryKafkaTopics)[keyof typeof TreasuryKafkaTopics];

export interface CapacityUpdatedPayload {
  eventType: 'CAPACITY_UPDATED';
  programId: string;
  totalCapacity: number;
  currency: string;
  timestamp: string;
}

export interface InvoiceReservedPayload {
  eventType: 'INVOICE_RESERVED';
  programId: string;
  invoiceId: string;
  amount: number;
  currency: string;
  timestamp: string;
}

export interface InvoiceReleasedPayload {
  eventType: 'INVOICE_RELEASED';
  invoiceId: string;
  timestamp: string;
}

export interface ReconciliationRequestedPayload {
  eventType: 'RECONCILIATION_REQUESTED';
  programId: string;
  totalCapacity?: number;
  activeInvoices: Array<{
    invoiceId: string;
    amount: number;
    currency: string;
  }>;
  timestamp: string;
}

export interface TreasuryEventPayloadMap {
  [TreasuryKafkaTopics.CAPACITY_UPDATED]: CapacityUpdatedPayload;
  [TreasuryKafkaTopics.INVOICE_RESERVED]: InvoiceReservedPayload;
  [TreasuryKafkaTopics.INVOICE_RELEASED]: InvoiceReleasedPayload;
  [TreasuryKafkaTopics.RECONCILIATION_REQUESTED]: ReconciliationRequestedPayload;
}
