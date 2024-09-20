import type { Context } from "telegraf";

interface CommandOptions {
  name: string;
  description: string;
}

export abstract class Command {
  name: string;
  description: string;

  abstract handler(ctx: Context): void | Promise<void>;

  constructor(options: CommandOptions) {
    this.name = options.name;
    this.description = options.description;
  }
}
