import { Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef, MatSnackBarLabel } from '@angular/material/snack-bar';
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from '@angular/material/button';

export interface SnackBarConfig {
  message: string,
};

@Component({
  selector: 'app-snackbar',
  template: `
    <div class="snackbar">
      <span matSnackBarLabel >{{ data.message }}</span>
      <button mat-icon-button (click)="close()">
        <mat-icon class="icon">close</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .snackbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .icon {
      font-size: 20px;
      margin-bottom: -2px;
      margin-right: -2px;
    }
  `],
  imports: [MatIcon, MatIconButton, MatSnackBarLabel]
})
export class SnackbarComponent {
  private readonly snackBarRef = inject(MatSnackBarRef<SnackbarComponent>);
  readonly data = inject<SnackBarConfig>(MAT_SNACK_BAR_DATA);

  close(): void {
    this.snackBarRef.dismiss();
  }
}
