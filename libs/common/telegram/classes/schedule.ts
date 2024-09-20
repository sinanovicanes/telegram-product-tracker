import { Logger } from "@app/common/logger";
import { CronJob } from "cron";

export abstract class Schedule extends CronJob {
  protected readonly logger = new Logger(this.constructor.name);

  abstract name: string;
  abstract onSchedule(): void | Promise<void>;

  constructor(
    cronTime: string,
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  ) {
    super(cronTime, () => this.onTick(), null, false, timeZone);
  }

  private async onTick() {
    try {
      await this.onSchedule();
    } catch (e) {
      this.logger.error(`${e}`);
    }
  }
}
