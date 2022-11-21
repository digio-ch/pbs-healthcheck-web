import {Injectable, TemplateRef} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {DialogComponent} from '../components/dialog/dialog.component';
import {DialogState} from '../store/dialog.state';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private matDialogRef: MatDialogRef<any>;
  private dialogControllers: DialogController[] = [];

  constructor(
    private matDialog: MatDialog,
    private dialogState: DialogState,
  ) { }

  open(template: TemplateRef<any>, config?: MatDialogConfig): void {
    this.dialogState.setLoading(false);

    if (this.matDialogRef) {
      this.matDialogRef.close();
      this.matDialogRef = null;
    }

    this.openDialog(template, config);
  }

  forceClose(dialogResult?: any): void {
    this.closeDialog(dialogResult);
  }

  async close(dialogResult?: any): Promise<void> {
    for (const controller of this.dialogControllers) {
      const result = await controller.onCloseRequest();
      if (!result) {
        return;
      }else if (result !== true) {
        dialogResult = result;
      }
    }
    this.closeDialog(dialogResult);
  }

  isLoading(): boolean {
    return this.dialogState.isLoading();
  }

  setLoading(loading: boolean): void {
    this.dialogState.setLoading(loading);
  }

  addDialogController(dialogController: DialogController): void {
    this.dialogControllers.push(dialogController);
  }

  private openDialog(template: TemplateRef<any>, config: MatDialogConfig = {}): void {
    config.data = {
      templateRef: template
    };
    this.matDialogRef = this.matDialog.open(DialogComponent, config);

    this.matDialogRef.backdropClick().subscribe(() => {
      this.close().then();
    });
  }

  private closeDialog(dialogResult?: any): void {
    const controllers = [...this.dialogControllers];
    this.dialogControllers = [];

    for (const controller of controllers) {
      controller.beforeClosed(dialogResult);
    }

    if (this.matDialogRef) {
      this.matDialogRef.close(dialogResult);
    }

    for (const controller of controllers) {
      controller.afterClosed(dialogResult);
    }
  }
}

export interface DialogController {
  onCloseRequest(): Promise<boolean>;
  beforeClosed(result: any): void;
  afterClosed(result: any): void;
}
