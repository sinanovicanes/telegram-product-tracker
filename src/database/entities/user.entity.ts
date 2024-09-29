import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  type Relation
} from "typeorm";
import { Tracker } from "./tracker.entity";

export enum USER_ROLE {
  ADMIN = "admin",
  USER = "user"
}

@Entity({ name: "users" })
export class User extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({ enum: USER_ROLE, default: USER_ROLE.USER, type: "enum" })
  role: USER_ROLE;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @OneToMany(() => Tracker, tracker => tracker.user)
  trackers: Relation<Tracker[]>;
}
