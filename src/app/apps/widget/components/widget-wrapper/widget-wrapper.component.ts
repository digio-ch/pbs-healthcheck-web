import { Component, inject, input, inputBinding, signal, viewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { Widget } from '../../../../shared/models/widget';
import { DateFacade } from '../../../../store/facade/date.facade';
import { WidgetFacade } from '../../../../store/facade/widget.facade';
import { PageType, WidgetTypeService } from '../../services/widget-type.service';
import { WidgetComponent } from '../widgets/widget/widget.component';
import { WidgetDirective } from './widget.directive';
import { NgStyle, AsyncPipe } from '@angular/common';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { WidgetGridDirective } from './widget-grid.directive';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Loadable } from 'src/app/shared/models/loadable';
import { DateSelection } from 'src/app/shared/models/date-selection/date-selection';
import { DateModel } from 'src/app/shared/models/date-selection/date.model';

@Component({
    selector: 'app-widget-wrapper',
    templateUrl: './widget-wrapper.component.html',
    styleUrls: ['./widget-wrapper.component.scss'],
    imports: [LoadingComponent, WidgetGridDirective, NgStyle, WidgetDirective, AsyncPipe, TranslatePipe]
})
export class WidgetWrapperComponent {
  private widgetFacade = inject(WidgetFacade);
  private dateFacade = inject(DateFacade);
  private widgetTypeService = inject(WidgetTypeService);

  readonly widgetDirective = viewChild.required<WidgetDirective>(WidgetDirective);

  /**
   * Defines which widgets are being displayed
   */
  readonly pageType = input.required<PageType>();
  readonly filterLoadable = input.required<Loadable>();

  readonly isFilterLoading = toSignal(
    toObservable(this.filterLoadable).pipe(
      switchMap(loadable => loadable.isLoading$()),
    ),
    {
      initialValue: true,
    },
  );

  readonly isRange = signal(false);

  get loading$(): Observable<boolean> {
    return this.widgetFacade.isLoading$();
  }

  get error$(): Observable<boolean> {
    return this.widgetFacade.hasError$();
  }

  constructor() {
    toObservable(this.pageType).pipe(
      takeUntilDestroyed(),
      switchMap(pageType => 
        this.widgetFacade.getWidgetData$(pageType)
      ),
      withLatestFrom(
        this.dateFacade.getDateSelection$(),
        this.dateFacade.getAvailableDates$(),
      ),
    ).subscribe(([widgetData, dateSelection, availableDates]) => {
      this.isRange.set(dateSelection.isRange);
      this.initWidgets(widgetData, dateSelection, availableDates);
    })
  }

  initWidgets(widgets: Widget[], dateSelection: DateSelection, availableDates: DateModel[]) {
    const isRange = dateSelection.isRange;

    this.widgetDirective().viewContainerRef.clear();

    for (const widget of widgets) {
      if (isRange && !widget.supportsRange) {
        continue;
      }
      if (!isRange && !widget.supportsDate) {
        continue;
      }
      if ((!widget.data ) && !widget.allowEmpty) {
        continue;
      }
      
      const type = this.widgetTypeService.getTypeFor(widget.className);
      const component = this.widgetDirective().viewContainerRef.createComponent<WidgetComponent>(type, {
        bindings: [
          inputBinding('chartData', () => widget.data),
          inputBinding('dateSelection', () => dateSelection),
          inputBinding('availableDates', () => availableDates),
        ],
      });
      component.location.nativeElement.style.gridArea = widget.uid;
    }
  }
}
