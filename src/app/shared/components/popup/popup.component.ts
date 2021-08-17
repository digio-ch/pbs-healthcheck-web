import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PopupData} from "../../services/popup.service";

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
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
