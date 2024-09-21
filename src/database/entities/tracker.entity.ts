import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation
} from "typeorm";
import { Item } from "./item.entity";
import { User } from "./user.entity";

@Entity()
@Index(["item", "user"], { unique: true })
export class Tracker extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item)
  item: Relation<Item>;

  @ManyToOne(() => User)
  user: Relation<User>;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
