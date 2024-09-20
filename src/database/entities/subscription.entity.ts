import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation
} from "typeorm";
import { Item } from "./item.entity";
import { User } from "./user.entity";

@Entity()
export class Subscription extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item)
  item: Relation<Item>;

  @ManyToOne(() => User)
  user: Relation<User>;

  @Column({ type: "jsonb" })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
