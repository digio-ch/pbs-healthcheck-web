import { Component, computed, inject, TemplateRef, viewChild } from '@angular/core';
import { DepartmentsDialogComponent } from '../../departments-dialog/departments-dialog.component';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { MyOrganizationPreviewStore } from '../../../stores/my-ogranization-preview.store';

@Component({
  standalone: true,
  selector: 'app-my-organization-preview-tooltip',
  templateUrl: './my-organization-preview-tooltip.component.html',
  styleUrl: './my-organization-preview-tooltip.component.scss',
  imports: [DepartmentsDialogComponent],
})
export class MyOrganizationPreviewTooltipComponent {
  private dialogService = inject(DialogService);
  private previewStore = inject(MyOrganizationPreviewStore);

  readonly dialog = viewChild.required<TemplateRef<DepartmentsDialogComponent>>('dialog');

  readonly departments = computed(
    () => this.previewStore.data()?.departments
  );

  open(e: PointerEvent) {
    // prevent widget click
    e.stopPropagation();

    this.dialogService.open(this.dialog());
  }
}
