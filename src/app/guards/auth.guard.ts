import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppFacade } from '../store/facade/app.facade';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(
    private appFacade: AppFacade,
    private router: Router
  ) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.appFacade.isCurrentlyLoggedIn()) {
      return true;
    }

    this.router.navigate(['login']);
    return false;
  }

}
