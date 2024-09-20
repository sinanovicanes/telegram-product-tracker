import { DataSource } from "typeorm";
import { Item, Subcription, User } from "./entities";
import { env } from "@app/common";

export const AppDataSource = await new DataSource({
  type: "postgres",
  url: env.DATABASE_URL,
  synchronize: env.NODE_ENV === "development",
  entities: [User, Item, Subcription]
}).initialize();

export const userRepository = AppDataSource.getRepository(User);
export const itemRepository = AppDataSource.getRepository(Item);
export const subscriptionRepository = AppDataSource.getRepository(Subcription);
