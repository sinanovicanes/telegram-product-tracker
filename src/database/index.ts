import { DataSource } from "typeorm";
import { Item, Tracker, User } from "./entities";
import { env } from "@app/common";

export const AppDataSource = await new DataSource({
  type: "postgres",
  url: env.DATABASE_URL,
  synchronize: env.NODE_ENV === "development",
  entities: [User, Item, Tracker]
}).initialize();

export const userRepository = AppDataSource.getRepository(User);
export const itemRepository = AppDataSource.getRepository(Item);
export const trackerRepository = AppDataSource.getRepository(Tracker);
