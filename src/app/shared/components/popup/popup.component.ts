import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PopupData } from '../../services/popup.service';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss'],
    imports: [MatIcon, NgClass, TranslatePipe]
})
export class PopupComponent implements OnInit {
  data = inject<PopupData>(MAT_DIALOG_DATA);
  dialogRef = inject<MatDialogRef<PopupComponent>>(MatDialogRef);


  ngOnInit(): void {
    this.dialogRef.afterClosed().subscribe(this.data.onClose);
  }

  cancel() {
    this.data.onCancel();

    this.dialogRef.close(false);
  }

  submit() {
    this.data.onSubmit();

    this.dialogRef.close(true);
  }

}
