import { Logger } from "@app/common";
import { Glob } from "bun";
import { Command } from "../classes";
<<<<<<< HEAD
<<<<<<< HEAD
import { container } from "tsyringe";
=======
>>>>>>> f22edf2 (Initial commit)
=======
import { container } from "tsyringe";
>>>>>>> f719c3e (refactor: Update loaders to resolve instances from container)

export class CommandLoader {
  private static readonly logger = new Logger(CommandLoader.name);

  static async load(path: string): Promise<Command[]> {
    const commands: Command[] = [];
    const glob = new Glob(path);

    for await (const filePath of glob.scan()) {
      let file: any;

      try {
        file = await import(filePath);
<<<<<<< HEAD
      } catch (e) {
        this.logger.error(`Failed to load ${filePath}: ${e}`);
=======
      } catch {
        this.logger.error(`Failed to load file: ${filePath}`);
>>>>>>> f22edf2 (Initial commit)
        continue;
      }

      for (const key in file) {
        if (file[key].prototype instanceof Command) {
          try {
<<<<<<< HEAD
<<<<<<< HEAD
            const command = container.resolve<Command>(file[key]);
=======
            const command = new file[key]();
>>>>>>> f22edf2 (Initial commit)
=======
            const command = container.resolve<Command>(file[key]);
>>>>>>> f719c3e (refactor: Update loaders to resolve instances from container)

            commands.push(command);
          } catch (e) {
            this.logger.error(`Failed to load ${file[key].name}: ${e}`);
          }
        }
      }
    }

    return commands;
  }
}
