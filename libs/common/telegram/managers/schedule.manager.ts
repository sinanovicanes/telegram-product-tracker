import { Injectable, Logger, pluralify } from "@app/common";
import type { Schedule } from "../classes";
import { ScheduleLoader } from "../loaders";

enum SCHEDULE_STATUS {
  PENDING = "PENDING",
  RUNNING = "RUNNING"
}

@Injectable()
export class ScheduleManager {
  private readonly logger = new Logger(ScheduleManager.name);
  private readonly schedules = new Map<Schedule["name"], Schedule>([]);
  private status = SCHEDULE_STATUS.PENDING;

  async initialize(start = false) {
    const schedules = await ScheduleLoader.load("src/schedules/**/*.ts");

    schedules.forEach(schedule => {
      this.schedules.set(schedule.name, schedule);
    });

    this.logger.info(
      `${schedules.length} ${pluralify("schedule", "schedules", schedules.length)} loaded`
    );

    if (start) {
      this.start();
    }
  }

  start() {
    if (this.status === SCHEDULE_STATUS.RUNNING) {
      return this.logger.warn("Schedules already running");
    }

    this.schedules.forEach(job => job.start());

    this.status = SCHEDULE_STATUS.RUNNING;
    this.logger.info(
      `${this.schedules.size} ${pluralify(
        "schedule",
        "schedules",
        this.schedules.size
      )} started`
    );
  }

  stop() {
    if (this.status === SCHEDULE_STATUS.PENDING) {
      return this.logger.warn("Schedules already stopped");
    }

    this.schedules.forEach(job => job.stop());

    this.status = SCHEDULE_STATUS.PENDING;
    this.logger.info(
      `${this.schedules.size} ${pluralify(
        "schedule",
        "schedules",
        this.schedules.size
      )} stopped`
    );
  }
}
