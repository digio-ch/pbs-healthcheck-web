import { Component, OnInit, TemplateRef, inject } from '@angular/core';
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
  data = inject(MAT_DIALOG_DATA);
  private dialogState = inject(DialogState);


  templateRef: TemplateRef<any>;

  constructor() {
    const data = this.data;

    this.templateRef = data.templateRef;
  }

  ngOnInit(): void {
  }

  get isLoading$(): Observable<boolean> {
    return this.dialogState.isLoading$();
  }

}
