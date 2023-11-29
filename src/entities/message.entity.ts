import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Message {
  @PrimaryColumn('uuid')
  message_id: string;

  @Column('uuid')
  sender_id: string;

  @Column('uuid')
  recipient_id: string;

  @Column()
  message_content: string;

  @Column()
  timestamp: Date;
}
