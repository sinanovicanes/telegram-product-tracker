import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
<<<<<<< HEAD
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation
<<<<<<< HEAD
} from "typeorm";
import { Subscription } from "./subscription.entity";
=======
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
>>>>>>> e28a3a6 (feat: Add database connection with dockerfiles and entities)
=======
} from "typeorm";
import { Subscription } from "./subscription.entity";
>>>>>>> e74af0b (feat: Add item control schedule)

@Entity()
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  url: string;

<<<<<<< HEAD
<<<<<<< HEAD
  @Column({ type: "timestamp", name: "last_control", default: () => "CURRENT_TIMESTAMP" })
=======
  @Column({ type: "timestamp", name: "last_control" })
>>>>>>> e28a3a6 (feat: Add database connection with dockerfiles and entities)
=======
  @Column({ type: "timestamp", name: "last_control", default: () => "CURRENT_TIMESTAMP" })
>>>>>>> e74af0b (feat: Add item control schedule)
  lastControl: Date;

  @Column({ type: "jsonb" })
  metadata: Record<string, any>;

<<<<<<< HEAD
=======
  @Column({ name: "item_id" })
  itemId: string;

  @Column({ name: "user_id" })
  userId: string;

>>>>>>> e28a3a6 (feat: Add database connection with dockerfiles and entities)
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
<<<<<<< HEAD

  @OneToMany(() => Subscription, subcription => subcription.item)
  subscribers: Relation<Subscription[]>;
<<<<<<< HEAD
=======
>>>>>>> e28a3a6 (feat: Add database connection with dockerfiles and entities)
=======
>>>>>>> e74af0b (feat: Add item control schedule)
}
