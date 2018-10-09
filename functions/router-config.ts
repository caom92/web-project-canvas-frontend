import { ExtraOptions, Route } from '@angular/router'
import { AuthenticationGuard } from '../services/authentication-guard'


export function getRouterConfig(enableTracing: boolean): ExtraOptions {
  return {
    enableTracing: enableTracing,
    onSameUrlNavigation: 'reload',
    anchorScrolling: 'enabled'
  }
}

export function getRouteRequiringAuthentication(
  path: string, 
  component: any
): Route {
  return {
    path: path,
    component: component,
    data: { requiresLogIn: true },
    canActivate: [ AuthenticationGuard ]
  }
}
