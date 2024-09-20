import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
<<<<<<< HEAD
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  type Relation
} from "typeorm";
import { Subscription } from "./subscription.entity";
=======
  PrimaryColumn,
  UpdateDateColumn
} from "typeorm";
>>>>>>> e28a3a6 (feat: Add database connection with dockerfiles and entities)

export enum USER_ROLE {
  ADMIN = "admin",
  USER = "user"
}

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({ enum: USER_ROLE, default: USER_ROLE.USER, type: "enum" })
  role: USER_ROLE;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
<<<<<<< HEAD

  @OneToMany(() => Subscription, subcription => subcription.user)
  subcriptions: Relation<Subscription[]>;
=======
>>>>>>> e28a3a6 (feat: Add database connection with dockerfiles and entities)
}
