import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { GroupFacade } from '../../../../../store/facade/group.facade';
import { WidgetService } from '../../../services/widget.service';
import { LegendPosition } from '@swimlane/ngx-charts';

import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { CustomPieChartComponent } from '../../../../../chart/components/custom-pie-chart/custom-pie-chart.component';

@Component({
    selector: 'app-widgets-app-preview',
    templateUrl: './widgets-app-preview.component.html',
    styleUrls: ['./widgets-app-preview.component.scss'],
    imports: [LoadingComponent, CustomPieChartComponent]
})
export class WidgetsAppPreviewComponent implements AfterViewInit, OnDestroy {
  private groupFacade = inject(GroupFacade);
  private widgetService = inject(WidgetService);


  colorScheme = {
    domain: []
  } as any;

  chartData: any;
  loading = true;

  private destroyed$ = new Subject();
  legendPosition = LegendPosition.Below;

  ngAfterViewInit(): void {
    this.groupFacade.getCurrentGroup$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(group => {
      this.loading = true;

      this.widgetService.getPreview(group.id).pipe(
        takeUntil(this.destroyed$),
        first(),
      ).subscribe(data => {
        this.chartData = data;

        for (const item of this.chartData) {
          this.colorScheme.domain.push(item.color);
        }

        this.loading = false;
      });
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
