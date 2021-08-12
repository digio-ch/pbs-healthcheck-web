import {Component, Inject, OnInit, TemplateRef} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogService} from "../../services/dialog.service";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  templateRef: TemplateRef<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogService: DialogService,
  ) {
    this.templateRef = data.templateRef;
  }

  ngOnInit(): void {
  }

  get isLoading(): boolean {
    return this.dialogService.isLoading();
  }

}
