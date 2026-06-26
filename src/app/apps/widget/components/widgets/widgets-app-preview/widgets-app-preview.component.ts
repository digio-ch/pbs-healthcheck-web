import { Component, computed, inject, signal } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { GroupFacade } from '../../../../../store/facade/group.facade';
import { WidgetService } from '../../../services/widget.service';
import { Color, LegendPosition } from '@swimlane/ngx-charts';

import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { CustomPieChartComponent } from '../../../../../chart/components/custom-pie-chart/custom-pie-chart.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-widgets-app-preview',
    templateUrl: './widgets-app-preview.component.html',
    styleUrls: ['./widgets-app-preview.component.scss'],
    imports: [LoadingComponent, CustomPieChartComponent]
})
export class WidgetsAppPreviewComponent {
  private groupFacade = inject(GroupFacade);
  private widgetService = inject(WidgetService);

  readonly isLoading = signal(true);

  readonly chartData = toSignal(
    this.groupFacade.getCurrentGroup$().pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(group => this.widgetService.getPreview(group.id)),
      tap(() => this.isLoading.set(false)),
    ),
    {
      initialValue: [],
    }
  );

  readonly colorScheme = computed(() => ({
    domain: this.chartData().map(item => item.color),
  }) as Color);

  readonly legendPosition = LegendPosition.Below;
}
