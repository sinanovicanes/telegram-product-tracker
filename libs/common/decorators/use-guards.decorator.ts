import { container } from "tsyringe";
import { GUARD_METADATA_KEY } from "../constants";
import type { Constructor } from "../interfaces";
import { Command, type Guard } from "../telegram";

export function UseGuards(...guards: Constructor<Guard>[]): ClassDecorator {
  return (target: any) => {
    if (!(target.prototype instanceof Command)) {
      throw new Error("UseGuards decorator can only be used on Command classes");
    }

    Reflect.defineMetadata(
      GUARD_METADATA_KEY,
      guards.map(guard => container.resolve(guard)),
      target
    );
  };
}
