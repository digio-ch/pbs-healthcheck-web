import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackbarComponent, SnackBarConfig } from '../components/snack-bar/snack-bar.component';

type Variant = 'info' | 'success' | 'error';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  snackBar = inject(MatSnackBar);

  info(message: string, duration: number = -1) {
    this.show('info', message, this.withDuration(duration));
  }

  success(message: string, duration: number = -1) {
    this.show('success', message, this.withDuration(duration));
  }

  error(message: string, duration: number = -1) {
    this.show('error', message, this.withDuration(duration));
  }

  private show(variant: Variant, message: string, options: MatSnackBarConfig<SnackBarConfig> = {}) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      panelClass: this.variantToPanelClass(variant),
      data: { message },
      ...options,
    });
  }

  private variantToPanelClass(variant: Variant): string {
    return `${variant}-notification`;
  }

  private withDuration(duration: number): MatSnackBarConfig<any> {
    if (duration <= 0) {
      return {}
    }

    return { duration }
  }
}
