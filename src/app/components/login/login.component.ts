import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppFacade} from '../../store/facade/app.facade';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading = false;

  constructor(
    private appFacade: AppFacade,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.data.action === 'callback') {
      this.activatedRoute.queryParamMap.pipe(first()).subscribe(value => {
        this.loginUsingCode(value.get('code'));
      });
    }
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
}
