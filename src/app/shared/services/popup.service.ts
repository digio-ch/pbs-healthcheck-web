import { Injectable } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {PopupComponent} from "../components/popup/popup.component";

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(
    private matDialog: MatDialog
  ) { }

  open(data?: PopupData): Promise<boolean> {
    const popupData = { ...defaultPopupData, ...data };

    const matDialogRef = this.matDialog.open(PopupComponent, {
      data: popupData,
      width: '400px',
    });
    return matDialogRef.afterClosed().toPromise().then(result => {
      return result;
    });
  }
}

export interface PopupData {
  title?: string;
  message?: string;
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
