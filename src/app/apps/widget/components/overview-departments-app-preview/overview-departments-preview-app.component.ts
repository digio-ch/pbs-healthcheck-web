import { Component, computed, inject, signal } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { GroupFacade } from 'src/app/store/facade/group.facade';
import { WidgetService } from '../../services/widget.service';
import { Color, LegendPosition } from '@swimlane/ngx-charts';

import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { CustomPieChartComponent } from '../../../../chart/components/custom-pie-chart/custom-pie-chart.component';
import { TranslatePipe } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-overview-departments-app-preview',
    templateUrl: './overview-departments-app-preview.component.html',
    styleUrls: ['./overview-departments-app-preview.component.scss'],
    imports: [LoadingComponent, CustomPieChartComponent, TranslatePipe]
})
export class OverviewDepartmentsAppPreviewComponent {
  private groupFacade = inject(GroupFacade);
  private widgetService = inject(WidgetService);

  readonly isLoading = signal(true);

  readonly data = toSignal(
    this.groupFacade.getCurrentGroup$().pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(group => this.widgetService.getDepartmentsPreview(group.id)),
      tap(() => this.isLoading.set(false)),
    ),
    {
      initialValue: {
        groupTypes: [],
        departments: 0,
      },
    }
  );

  readonly chartData = computed(() => {
    return this.data().groupTypes;
  });

  readonly departmentCount = computed(() => {
    return this.data().departments;
  });

  readonly colorScheme = computed(() => ({
    domain: this.chartData().map(item => item.color),
  }) as Color);

  readonly legendPosition = LegendPosition.Below;
}
