import { Column, DeepPartial, Entity } from 'typeorm';
import { BaseEntity } from './base-entity';

@Entity('email_logs')
export class EmailLogEntity extends BaseEntity {
  constructor(partial?: DeepPartial<EmailLogEntity>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ name: 'from', nullable: true })
  fromEmail: string;

  @Column({ name: 'to', nullable: true })
  toEmail: string;

  @Column({ name: 'subject', nullable: true })
  subject: string;

  @Column({ name: 'template', nullable: true })
  template: string;

  @Column({ name: 'context', nullable: true })
  context: string;

  @Column({ name: 'type', nullable: true })
  type: string;

  @Column({ name: 'status', nullable: true })
  status: string;

  @Column({ name: 'error', nullable: true })
  error: string;
}
