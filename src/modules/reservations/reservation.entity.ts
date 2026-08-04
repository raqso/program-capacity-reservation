import { Entity, Column, Index } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';

export enum ReservationStatus {
  ACTIVE = 'ACTIVE',
  RELEASED = 'RELEASED',
}

const numericTransformer = {
  to: (value: number): number => value,
  from: (value: string): number => parseFloat(value),
};

@Entity('reservations')
@Index(
  'idx_reservations_program_active',
  ['programId', 'reservedAmountInProgramCurrency'],
  {
    where: `"status" = 'ACTIVE'`,
  },
)
export class ReservationEntity extends BaseEntity {
  @Index()
  @Column({ type: 'uuid' })
  programId: string;

  @Column({ type: 'varchar', length: 128, unique: true })
  invoiceId: string;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    transformer: numericTransformer,
  })
  originalAmount: number;

  @Column({ type: 'varchar', length: 3 })
  originalCurrency: string;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    transformer: numericTransformer,
  })
  reservedAmountInProgramCurrency: number;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.ACTIVE,
  })
  status: ReservationStatus;
}
