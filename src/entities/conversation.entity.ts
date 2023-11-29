import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Conversation {
  @PrimaryColumn('uuid')
  conversation_id: string;

  @Column('uuid')
  user1_id: string;

  @Column('uuid')
  user2_id: string;
}
