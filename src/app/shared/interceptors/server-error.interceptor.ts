import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppFacade } from '../../store/facade/app.facade';
import { DialogService } from '../services/dialog.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private dialogService = inject(DialogService);
  private injector = inject(Injector);


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(tap(
        () => {},
        error => {
          if (!(error instanceof HttpErrorResponse)) {
            // client error
            console.log('client error?');
            console.log(error);
            return;
          }
          if (error.status === 401) {
            const appFacade = this.injector.get(AppFacade);
            this.notificationService.error(error.error);
            appFacade.logOut().subscribe(_ => {
              this.dialogService.forceClose();
              this.router.navigate(['login']);
            });
            return;
          }
          if (error.error.message) {
            this.notificationService.error(error.error.error.message);
            return;
          }
          const translator = this.injector.get(TranslateService);
          translator.get('notification.error.unknown').subscribe(res => {
            this.notificationService.error(res);
          });
        }
    ));
  }
}
