import { Logger } from "@app/common/logger";
import { Schedule } from "../classes";
import { Glob } from "bun";
import { container } from "tsyringe";

export class ScheduleLoader {
  private static readonly logger = new Logger(ScheduleLoader.name);

  static async load(path: string): Promise<Schedule[]> {
    const schedules: Schedule[] = [];
    const glob = new Glob(path);

    for await (const filePath of glob.scan()) {
      let file: any;

      try {
        file = await import(filePath);
      } catch (e) {
        this.logger.error(`Failed to load ${filePath}: ${e}`);
        continue;
      }

      for (const key in file) {
        if (file[key].prototype instanceof Schedule) {
          try {
            const schedule = container.resolve<Schedule>(file[key]);

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
