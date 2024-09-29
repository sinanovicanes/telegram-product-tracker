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
import { BRAND } from "@/enums";

@Entity({ name: "items" })
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "brand", type: "enum", enum: BRAND })
  brand: BRAND;

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

  @OneToMany(() => Tracker, tracker => tracker.item)
  trackers: Relation<Tracker[]>;
}
