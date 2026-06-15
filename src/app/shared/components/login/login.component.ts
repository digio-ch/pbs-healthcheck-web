import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { AppFacade } from '../../../store/facade/app.facade';
import { StatusMessage } from '../../models/status-message';
import { StatusMessageService } from '../../services/status-message.service';
import { MatButton } from '@angular/material/button';
import { LoadingButtonDirective } from '../../directives/loading-button.directive';
import { NgClass } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [MatButton, LoadingButtonDirective, NgClass, FooterComponent, TranslatePipe]
})
export class LoginComponent implements OnInit, OnDestroy {
  private appFacade = inject(AppFacade);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private statusService = inject(StatusMessageService);


  loading = false;
  statusMessage: StatusMessage | null = null;
  private destroyed$ = new Subject();

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.data.action === 'callback') {
      this.activatedRoute.queryParamMap.pipe(first()).subscribe(value => {
        this.loginUsingCode(value.get('code'));
      });
    }

    this.statusService.getStatusMessage()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(status => this.statusMessage = status);
  }

  login() {
    this.appFacade.openOAuth();
  }

  loginUsingCode(code: string) {
    this.loading = true;
    this.appFacade.logIn(code).subscribe({
      next: _ => {
        this.loading = false;
        this.router.navigate(['']);
      },
      error: _ => {
        this.loading = false;
        this.router.navigate(['login']);
      }
    });
  }

  ngOnDestroy(): void {
      this.destroyed$.next(true);
      this.destroyed$.complete();
  }
}
