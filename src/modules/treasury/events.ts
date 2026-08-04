export const TreasuryKafkaTopics = {
  CAPACITY_UPDATED: 'treasury.capacity.updated',
  RECONCILIATION_REQUESTED: 'treasury.reconciliation.requested',
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

export interface ReconciliationRequestedPayload {
  eventType: 'RECONCILIATION_REQUESTED';
  programId: string;
  externalReservedCapacity?: number;
  timestamp: string;
}

export interface TreasuryEventPayloadMap {
  [TreasuryKafkaTopics.CAPACITY_UPDATED]: CapacityUpdatedPayload;
  [TreasuryKafkaTopics.RECONCILIATION_REQUESTED]: ReconciliationRequestedPayload;
}
