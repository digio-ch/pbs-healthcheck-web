import { Component, computed, inject } from '@angular/core';
import { CustomPieChartComponent } from "src/app/chart/components/custom-pie-chart/custom-pie-chart.component";
import { LoadingComponent } from "src/app/shared/components/loading/loading.component";
import { TranslatePipe } from '@ngx-translate/core';
import { Color, LegendPosition } from '@swimlane/ngx-charts';
import { MyOrganizationPreviewStore } from '../../../stores/my-ogranization-preview.store';

@Component({
  standalone: true,
  selector: 'app-my-organization-preview-chart',
  templateUrl: './my-organization-preview-chart.component.html',
  styleUrl: './my-organization-preview-chart.component.scss',
  imports: [CustomPieChartComponent, LoadingComponent, TranslatePipe],
})
export class MyOrganizationPreviewChartComponent {
  readonly previewStore = inject(MyOrganizationPreviewStore);

  readonly departmentsCount = computed(() => {
    const data = this.previewStore.data();

    if (!data) {
      return 0;
    }

    return data.departments.length;
  });
  readonly colorScheme = computed<Color>(() => {
    const data = this.previewStore.data();

    if (!data) {
      return {
        domain: [],
      } as Color;
    }

    return {
      domain: data.groupTypes.map(gt => gt.color),
    } as Color;
  });

  readonly legendPosition = LegendPosition.Below;
}
