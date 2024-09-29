import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation
} from "typeorm";
import { Item } from "./item.entity";
import { User } from "./user.entity";

@Entity()
@Index(["item", "user"], { unique: true })
export class Tracker extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item, { onDelete: "CASCADE" })
  item: Relation<Item>;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: Relation<User>;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
