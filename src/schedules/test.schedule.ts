import { Injectable } from "@app/common/decorators";
import { Schedule } from "@app/common/telegram";

@Injectable()
export class TestSchedule extends Schedule {
  name = "TestSchedule";

  constructor() {
    super("*/15 * * * * *");
  }

  onSchedule() {
    this.logger.log("Executed");
  }
}
