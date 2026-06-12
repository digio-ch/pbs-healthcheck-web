import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../components/popup/popup.component';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private matDialog = inject(MatDialog);


  async open(data?: PopupData): Promise<boolean> {
    const popupData = { ...defaultPopupData, ...data };

    const matDialogRef = this.matDialog.open(PopupComponent, {
      data: popupData,
      width: '400px',
    });
    const result = await lastValueFrom(matDialogRef.afterClosed());
    return result;
  }
}

export enum PopupType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

export interface PopupData {
  title?: string;
  message?: string;
  type?: PopupType;
  cancel?: string;
  submit?: string;

  onCancel?: () => void;
  onSubmit?: () => void;
  onClose?: () => void;
}

const defaultPopupData: PopupData = {
  title: 'dialog.default.title',
  message: 'dialog.default.message',
  cancel: 'dialog.default.cancel',
  submit: 'dialog.default.submit',

  onCancel: () => {},
  onSubmit: () => {},
  onClose: () => {},
};
