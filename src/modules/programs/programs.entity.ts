import { Entity, Column } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';

const numericTransformer = {
  to: (value: number): number => value,
  from: (value: string): number => parseFloat(value),
};

@Entity('programs')
export class ProgramEntity extends BaseEntity {
  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    transformer: numericTransformer,
  })
  totalCapacity: number;

  @Column({ type: 'varchar', length: 3 })
  currency: string;
}
