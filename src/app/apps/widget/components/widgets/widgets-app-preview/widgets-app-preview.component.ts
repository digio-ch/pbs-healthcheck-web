import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {GroupFacade} from '../../../../../store/facade/group.facade';
import {Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {WidgetService} from '../../../services/widget.service';

@Component({
  selector: 'app-widgets-app-preview',
  templateUrl: './widgets-app-preview.component.html',
  styleUrls: ['./widgets-app-preview.component.scss']
})
export class WidgetsAppPreviewComponent implements AfterViewInit, OnDestroy {

  colorScheme = {
    domain: []
  };

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
