import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { GroupFacade } from 'src/app/store/facade/group.facade';
import { WidgetService } from '../../services/widget.service';

@Component({
  selector: 'app-overview-departments-app-preview',
  templateUrl: './overview-departments-app-preview.component.html',
  styleUrls: ['./overview-departments-app-preview.component.scss']
})
export class OverviewDepartmentsAppPreviewComponent implements AfterViewInit, OnDestroy {

  colorScheme = {
    domain: []
  };

  departmentCount = 0;
  chartData: any;
  loading = true;

  private destroyed$ = new Subject();

  constructor(
    private groupFacade: GroupFacade,
    private widgetService: WidgetService
  ) { }

  ngAfterViewInit(): void {
    this.groupFacade.getCurrentGroup$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(group => {
      this.loading = true;

      this.widgetService.getDepartmentsPreview(group.id).pipe(
        takeUntil(this.destroyed$),
        first(),
      ).subscribe(data => {
        this.chartData = data.groupTypes;
        this.departmentCount = data.departments;

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
