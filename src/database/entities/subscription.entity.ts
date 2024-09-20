import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
export class Subscription extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "item_id" })
  itemId: string;

  @Column({ name: "user_id" })
  userId: string;

  @Column({ type: "jsonb" })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
