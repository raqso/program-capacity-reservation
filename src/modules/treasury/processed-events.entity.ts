import { Entity, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('processed_events')
export class ProcessedEventEntity {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  // messageId is derived as `${topic}-${partition}-${offset}`
  messageId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  processedAt: Date;
}
