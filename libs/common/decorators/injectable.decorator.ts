import { injectable, type InjectionToken, Lifecycle, scoped, singleton } from "tsyringe";
import { INJECTION_SCOPES } from "../enums";

export const Injectable = (
  scope: INJECTION_SCOPES = INJECTION_SCOPES.SINGLETON,
  token?: InjectionToken
) => {
  switch (scope) {
    case INJECTION_SCOPES.SINGLETON:
      return singleton();
    case INJECTION_SCOPES.TRANSIENT:
      return injectable();
    case INJECTION_SCOPES.RESOLUTION:
      return scoped(Lifecycle.ResolutionScoped, token);
    case INJECTION_SCOPES.CONTAINER:
      return scoped(Lifecycle.ContainerScoped, token);
    default:
      throw new Error("Invalid scope");
  }
};
