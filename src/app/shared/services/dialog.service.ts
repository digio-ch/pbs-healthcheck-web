import {Injectable, TemplateRef} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {PopupComponent} from "../components/popup/popup.component";

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private matDialogRef: MatDialogRef<any>;

  constructor(
    private matDialog: MatDialog,
  ) { }

  open(template: TemplateRef<any>): DialogSubscription {
    if (this.matDialogRef) {
      this.matDialogRef.close();
      this.matDialogRef = null;
    }

    return this.openDialog(template);
  }

  private openDialog(template: TemplateRef<any>): DialogSubscription {
    this.matDialogRef = this.matDialog.open(template);
    return new DialogSubscription(this.matDialogRef);
  }

  private openPopup(data?: PopupData): void {
    const matDialogRef = this.matDialog.open(PopupComponent, { data });
  }
}

export class DialogSubscription {
  private afterOpenedCallback: any;
  private onCloseRequestCallback: () => boolean;
  private beforeClosedCallback: any;
  private afterClosedCallback: any;

  constructor(
    private matDialogRef: MatDialogRef<any>,
  ) {}

  afterOpened(callback: () => void): DialogSubscription {
    this.matDialogRef.afterOpened().subscribe(callback);
    return this;
  }

  onCloseRequest(callback: () => boolean): DialogSubscription {
    this.onCloseRequestCallback = callback;
    this.getDialogRef().backdropClick().subscribe(() => this.close());
    return this;
  }

  beforeClosed(callback: () => void): DialogSubscription {
    this.matDialogRef.beforeClosed().subscribe(callback);
    return this;
  }

  afterClosed(callback: () => void): DialogSubscription {
    this.matDialogRef.afterClosed().subscribe(callback);
    return this;
  }

  close(): boolean {
    if (this.onCloseRequestCallback()) {
      this.getDialogRef().close();
      return true;
    }
    return false;
  }

  withDialogRef(callback: (dialogRef: MatDialogRef<any>) => void): DialogSubscription {
    callback(this.matDialogRef);
    return this;
  }

  getDialogRef(): MatDialogRef<any> {
    return this.matDialogRef;
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
