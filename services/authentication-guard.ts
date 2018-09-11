import { 
  CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router 
} from '@angular/router'
import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'


@Injectable()
export class AuthenticationNavGuard implements CanActivate {

  constructor(private readonly router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const requiresLogIn = route.data.requiresLogIn || false
    if (requiresLogIn) {
      const isUserLoggedIn = 
        localStorage.getItem('is_logged_in') !== undefined
        && localStorage.getItem('is_logged_in') !== 'false'

      if (!isUserLoggedIn) {
        this.router.navigateByUrl('/login')
      }
    }

    return true
  }
}
