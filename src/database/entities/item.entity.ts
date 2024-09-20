import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  url: string;

  @Column({ type: "timestamp", name: "last_control" })
  lastControl: Date;

  @Column({ type: "jsonb" })
  metadata: Record<string, any>;

  @Column({ name: "item_id" })
  itemId: string;

  @Column({ name: "user_id" })
  userId: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
