import {Injectable, Injector} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {take, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {NotificationService} from '../services/notification.service';
import {AppFacade} from '../../store/facade/app.facade';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from '../services/dialog.service';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private injector: Injector,
  ) {
  }

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
            this.notificationService.showError(error.error, 5000);
            appFacade.logOut().subscribe(res => {
              this.dialogService.close();
              this.router.navigate(['login']);
            });
            return;
          }
          if (error.error.message) {
            this.notificationService.showError(error.error.error.message, 5000);
            return;
          }
          const translator = this.injector.get(TranslateService);
          translator.get('notification.error.unknown').subscribe(res => {
            this.notificationService.showError(res, 50000);
          });
        }
    ));
  }
}
