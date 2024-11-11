import { USER_ROLE } from "@/database/entities";
import { ProductControlService } from "@/services";
import { Injectable, Roles } from "@app/common/decorators";
import { Logger } from "@app/common/logger";
import { Command } from "@app/common/telegram";

@Injectable()
@Roles(USER_ROLE.ADMIN)
export class ControlCommand extends Command {
  private readonly logger = new Logger(ControlCommand.name);

  constructor(private readonly productControlService: ProductControlService) {
    super({
      name: "control",
      description: "Control products"
    });
  }

  async handler() {
    this.logger.log("Control command received");
    await this.productControlService.controlAll();
  }
}
