import {Injectable, TemplateRef} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../components/dialog/dialog.component";
import {DialogState} from '../store/dialog.state';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private matDialogRef: MatDialogRef<any>;

  constructor(
    private matDialog: MatDialog,
    private dialogState: DialogState,
  ) { }

  open(template: TemplateRef<any>, config?: MatDialogConfig): DialogSubscription {
    this.dialogState.setLoading(false);

    if (this.matDialogRef) {
      this.matDialogRef.close();
      this.matDialogRef = null;
    }

    return this.openDialog(template, config);
  }

  close(dialogResult?: any): void {
    if (this.matDialogRef) {
      this.matDialogRef.close(dialogResult);
    }
  }

  private openDialog(template: TemplateRef<any>, config: MatDialogConfig = {}): DialogSubscription {
    config.data = {
      templateRef: template
    };
    this.matDialogRef = this.matDialog.open(DialogComponent, config);
    return new DialogSubscription(this.matDialogRef);
  }

  isLoading(): boolean {
    return this.dialogState.isLoading();
  }

  setLoading(loading: boolean): void {
    this.dialogState.setLoading(loading);
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
