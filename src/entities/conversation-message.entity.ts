import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ConversationMessage {
  @PrimaryColumn('uuid')
  message_id: string;

  @PrimaryColumn('uuid')
  conversation_id: string;
}
