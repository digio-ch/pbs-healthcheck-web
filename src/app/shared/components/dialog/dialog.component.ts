import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogState } from '../../store/dialog.state';
import { Observable } from 'rxjs';
import { NgClass, NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { LoadingComponent } from '../loading/loading.component';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    imports: [NgClass, NgTemplateOutlet, LoadingComponent, AsyncPipe]
})
export class DialogComponent implements OnInit {

  templateRef: TemplateRef<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogState: DialogState,
  ) {
    this.templateRef = data.templateRef;
  }

  ngOnInit(): void {
  }

  get isLoading$(): Observable<boolean> {
    return this.dialogState.isLoading$();
  }

}
