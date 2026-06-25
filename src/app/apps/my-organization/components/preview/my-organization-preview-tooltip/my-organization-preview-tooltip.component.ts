import { Component, computed, inject } from '@angular/core';
import { MyOrganizationPreviewStore } from '../../../stores/my-ogranization-preview.store';
import { DepartmentsInfoComponent } from "../../departments-info/departments-info.component";

@Component({
  standalone: true,
  selector: 'app-my-organization-preview-tooltip',
  templateUrl: './my-organization-preview-tooltip.component.html',
  styleUrl: './my-organization-preview-tooltip.component.scss',
  imports: [DepartmentsInfoComponent],
})
export class MyOrganizationPreviewTooltipComponent {
  private previewStore = inject(MyOrganizationPreviewStore);

  readonly departments = computed(() => 
    this.previewStore.data()?.departments
  )
}
