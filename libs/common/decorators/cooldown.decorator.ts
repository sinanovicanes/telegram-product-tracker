import { COOLDOWN_METADATA_KEY } from "../constants";
import { Command } from "../telegram";
const DEFAULT_TIMEOUT = 5000;
export function Cooldown(timeout: number = DEFAULT_TIMEOUT): ClassDecorator {
  return (target: any) => {
    if (!(target.prototype instanceof Command)) {
      throw new Error("Cooldown decorator can only be used on Command classes");
    }
    Reflect.defineMetadata(COOLDOWN_METADATA_KEY, timeout, target);
  };
}
