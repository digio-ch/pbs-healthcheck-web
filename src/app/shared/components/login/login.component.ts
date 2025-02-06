import { Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {first, take, takeUntil} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppFacade} from '../../../store/facade/app.facade';
import { StatusMessageService } from '../../services/status-message.service';
import { Subject } from 'rxjs';
import { StatusMessage } from '../../models/status-message';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loading = false;
  statusMessage: StatusMessage | null = null;
  private destroyed$ = new Subject();

  constructor(
    private appFacade: AppFacade,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    private statusService: StatusMessageService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.data.action === 'callback') {
      this.activatedRoute.queryParamMap.pipe(first()).subscribe(value => {
        this.loginUsingCode(value.get('code'));
      });
    }

    this.translateService.onLangChange
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => 
        this.statusService.getStatusMessage()
          .pipe(take(1))
          .subscribe(status => this.statusMessage = status)
      );
  }

  login() {
    this.appFacade.openOAuth();
  }

  loginUsingCode(code: string) {
    this.loading = true;
    this.appFacade.logIn(code).subscribe(
      result => {
        this.loading = false;
        this.router.navigate(['']);
      },
      error => {
        this.loading = false;
        this.router.navigate(['login']);
      });
  }

  ngOnDestroy(): void {
      this.destroyed$.next(true);
      this.destroyed$.complete();
  }
}
