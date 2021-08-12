import {Injectable, TemplateRef} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private matDialogRef: MatDialogRef<any>;

  constructor(
    private matDialog: MatDialog,
  ) { }

  open(template: TemplateRef<any>, config?: MatDialogConfig): DialogSubscription {
    if (this.matDialogRef) {
      this.matDialogRef.close();
      this.matDialogRef = null;
    }

    return this.openDialog(template, config);
  }

  private openDialog(template: TemplateRef<any>, config?: MatDialogConfig): DialogSubscription {
    this.matDialogRef = this.matDialog.open(template, config);
    return new DialogSubscription(this.matDialogRef);
  }
}

export class DialogSubscription {
  private afterOpenedCallback: any;
  private onCloseRequestCallback: () => Promise<boolean>;
  private beforeClosedCallback: any;
  private afterClosedCallback: any;

  constructor(
    private matDialogRef: MatDialogRef<any>,
  ) {}

  afterOpened(callback: () => void): DialogSubscription {
    this.matDialogRef.afterOpened().subscribe(callback);
    return this;
  }

  onCloseRequest(callback: () => Promise<boolean>): DialogSubscription {
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

  close(): void {
    this.onCloseRequestCallback().then(result => {
      if (result) {
        this.getDialogRef().close();
        return true;
      }
      return false;
    });
  }

  withDialogRef(callback: (dialogRef: MatDialogRef<any>) => void): DialogSubscription {
    callback(this.matDialogRef);
    return this;
  }

  getDialogRef(): MatDialogRef<any> {
    return this.matDialogRef;
  }
}
