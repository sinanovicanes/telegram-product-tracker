import { container } from "tsyringe";
import { GUARD_METADATA_KEY, MIDDLEWARE_METADATA_KEY } from "../constants";
import type { Constructor } from "../interfaces";
import { Command, type Guard } from "../telegram";

export function UseMiddlewares(...middlewares: Constructor<Guard>[]): ClassDecorator {
  return (target: any) => {
    if (!(target.prototype instanceof Command)) {
      throw new Error("UseMiddlewares decorator can only be used on Command classes");
    }

    Reflect.defineMetadata(
      MIDDLEWARE_METADATA_KEY,
      middlewares.map(guard => container.resolve(guard)),
      target
    );
  };
}
