import type { USER_ROLE } from "@/database/entities";
import { ROLES_METADATA_KEY } from "../constants";
import { Command } from "../telegram";

export function Roles(...roles: USER_ROLE[]): ClassDecorator {
  return (target: any) => {
    if (!(target.prototype instanceof Command)) {
      throw new Error("Roles decorator can only be used on Command classes");
    }

    // Remove duplicates
    Reflect.defineMetadata(
      ROLES_METADATA_KEY,
      Array.from(new Set(roles).entries()),
      target
    );
  };
}
