import { USER_ROLE } from "@/database/entities";
import { UserService } from "@/services";
import { ROLES_METADATA_KEY } from "@app/common/constants";
import { Injectable } from "@app/common/decorators";
import { ExecutionContext, Guard } from "@app/common/telegram";

@Injectable()
export class AuthGuard extends Guard {
  constructor(private readonly userService: UserService) {
    super();
  }

  async canActivate(ctx: ExecutionContext) {
    const userId = ctx.getCtx().from.id.toString();

    if (!userId) return false;

    const user = await this.userService.getUser(userId);

    if (!user) return false;

    const roles: USER_ROLE[] | undefined = Reflect.getMetadata(
      ROLES_METADATA_KEY,
      ctx.getClass()
    );

    if (roles) {
      if (user.role != USER_ROLE.ADMIN && !roles.includes(user.role)) {
        return false;
      }
    }

    return true;
  }

  getErrorMessage() {
    return "You are not authorized to use this command";
  }
}
