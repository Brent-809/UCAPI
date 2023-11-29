import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class UserGroup {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  groupId: string;

  @Column()
  join_date: Date;
}
