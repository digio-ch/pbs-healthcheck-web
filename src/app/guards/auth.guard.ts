import { Injectable, inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppFacade } from '../store/facade/app.facade';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  private appFacade = inject(AppFacade);
  private router = inject(Router);


  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.appFacade.isCurrentlyLoggedIn()) {
      return true;
    }

    this.router.navigate(['login']);
    return false;
  }

}
