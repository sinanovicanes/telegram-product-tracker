import { DataSource } from "typeorm";
import { Product, Tracker, User } from "./entities";
import { env } from "@app/common";

export const AppDataSource = await new DataSource({
  type: "postgres",
  url: env.DATABASE_URL,
  synchronize: env.NODE_ENV === "development",
  entities: [User, Product, Tracker]
}).initialize();

export const userRepository = AppDataSource.getRepository(User);
export const productRepository = AppDataSource.getRepository(Product);
export const trackerRepository = AppDataSource.getRepository(Tracker);
