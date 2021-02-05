import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public snackBar: MatSnackBar) { }

  showSuccess(message: string, timeOut: number = -1) {
    if (timeOut === -1) {
      this.snackBar.open(message, 'x', {panelClass: 'sucess-notification'});
      return;
    }
    this.snackBar.open(message, 'x', {
      panelClass: 'sucess-notification',
      duration: timeOut
    });
  }

  showError(message: string, timeOut: number = -1) {
    if (timeOut === -1) {
      this.snackBar.open(message, 'x', {panelClass: 'error-notification'});
      return;
    }
    this.snackBar.open(message, 'x', {
      panelClass: 'error-notification',
      duration: timeOut
    });
  }
}
