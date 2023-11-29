// group.entity.ts
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Group {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  members: number;

  @Column('uuid', { array: true })
  allowedUsers: string[];
}

// Define other entity classes similarly for other tables
