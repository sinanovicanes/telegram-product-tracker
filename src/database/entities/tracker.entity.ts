import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation
} from "typeorm";
import { Product } from "./product.entity";
import { User } from "./user.entity";

@Entity({ name: "trackers" })
@Index(["product", "user"], { unique: true })
export class Tracker extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { onDelete: "CASCADE" })
  product: Relation<Product>;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: Relation<User>;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
