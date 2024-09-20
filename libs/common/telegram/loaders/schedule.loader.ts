import { Logger } from "@app/common";
import { Glob } from "bun";
import { Schedule } from "../classes";
<<<<<<< HEAD
<<<<<<< HEAD
import { container } from "tsyringe";
=======
>>>>>>> 52a77c9 (feat: Schedules)
=======
import { container } from "tsyringe";
>>>>>>> f719c3e (refactor: Update loaders to resolve instances from container)

export class ScheduleLoader {
  private static readonly logger = new Logger(ScheduleLoader.name);

  static async load(path: string): Promise<Schedule[]> {
    const schedules: Schedule[] = [];
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
>>>>>>> 52a77c9 (feat: Schedules)
        continue;
      }

      for (const key in file) {
        if (file[key].prototype instanceof Schedule) {
          try {
<<<<<<< HEAD
<<<<<<< HEAD
            const schedule = container.resolve<Schedule>(file[key]);
=======
            const schedule = new file[key]();
>>>>>>> 52a77c9 (feat: Schedules)
=======
            const schedule = container.resolve<Schedule>(file[key]);
>>>>>>> f719c3e (refactor: Update loaders to resolve instances from container)

            schedules.push(schedule);
          } catch (e) {
            this.logger.error(`Failed to load ${file[key].name}: ${e}`);
          }
        }
      }
    }

    return schedules;
  }
}
