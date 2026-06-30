import { Component, computed, inject, input, TemplateRef, viewChild } from '@angular/core';
import { DepartmentsDialogComponent } from '../departments-dialog/departments-dialog.component';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-departments-info',
  imports: [DepartmentsDialogComponent, TranslatePipe],
  templateUrl: './departments-info.component.html',
  styleUrl: './departments-info.component.scss',
})
export class DepartmentsInfoComponent {
  private dialogService = inject(DialogService);
  
  readonly dialog = viewChild.required<TemplateRef<DepartmentsDialogComponent>>('dialog');

  readonly displayCount = input(true);
  readonly departments = input<string[]>();

  readonly count = computed(() => 
    this.departments()?.length
  )

  open(e: PointerEvent) {
    e.stopPropagation();

    this.dialogService.open(this.dialog());
  }
}
