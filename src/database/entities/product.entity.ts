import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation
} from "typeorm";
import { Tracker } from "./tracker.entity";
import { MERCHANT } from "@/enums";

@Entity({ name: "products" })
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "merchant", type: "enum", enum: MERCHANT })
  merchant: MERCHANT;

  @Column({ unique: true })
  identifier: string;

  @Column({ name: "scrape_failures", default: 0 })
  scrapeFailures: number;

  @Column({ type: "jsonb" })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @OneToMany(() => Tracker, tracker => tracker.product)
  trackers: Relation<Tracker[]>;
}
