import { delay, inject, type InjectionToken } from "tsyringe";
import type { Constructor } from "../interfaces";

type WrappedConstructor<T = any> = () => Constructor<T>;
type TokenOrWrappedConstructor<T = any> = InjectionToken<T> | WrappedConstructor<T>;

export const Inject = <T>(token: TokenOrWrappedConstructor<T>) => {
  // If the token is a function and it doesn't have a constructor property, we assume it's a wrapped constructor it will fail otherwise
  if (typeof token === "function" && !token.prototype?.constructor) {
    return inject(delay(token as WrappedConstructor<T>));
  }

  return inject(token as InjectionToken<T>);
};
