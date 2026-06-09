import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PopupData } from '../../services/popup.service';
import { NgIf, NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss'],
    imports: [NgIf, MatIcon, NgClass, TranslatePipe]
})
export class PopupComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PopupData,
    public dialogRef: MatDialogRef<PopupComponent>,
  ) { }

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
