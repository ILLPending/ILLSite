import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor (
    private authService: AuthService
  ) { }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
      const user = await this.authService.pb.authStore.model?.id;
      const isAuthenticated = user? true : false;
      const isAdmin = this.authService.isCurrentUserAdmin()

      if(!isAuthenticated || !isAdmin) {
        return false;
      }
      return isAuthenticated;
    }
  
}
