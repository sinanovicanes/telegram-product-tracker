import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
<<<<<<< HEAD
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation
} from "typeorm";
import { Item } from "./item.entity";
import { User } from "./user.entity";
=======
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
>>>>>>> e28a3a6 (feat: Add database connection with dockerfiles and entities)

@Entity()
export class Subscription extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

<<<<<<< HEAD
  @ManyToOne(() => Item)
  item: Relation<Item>;

  @ManyToOne(() => User)
  user: Relation<User>;
=======
  @Column({ name: "item_id" })
  itemId: string;

  @Column({ name: "user_id" })
  userId: string;
>>>>>>> e28a3a6 (feat: Add database connection with dockerfiles and entities)

  @Column({ type: "jsonb" })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
