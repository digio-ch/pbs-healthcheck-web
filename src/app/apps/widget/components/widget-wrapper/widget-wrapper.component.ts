import {
  Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import {WidgetFacade} from '../../../../store/facade/widget.facade';
import {FilterFacade} from '../../../../store/facade/filter.facade';
import {WidgetDirective} from './widget.directive';
import {WidgetTypeService} from '../../services/widget-type.service';
import {Widget} from '../../../../shared/models/widget';
import {WidgetComponent} from '../widgets/widget/widget.component';
import {combineLatest, Subject} from 'rxjs';
import {GroupFacade} from '../../../../store/facade/group.facade';
import {BreadcrumbService} from '../../../../shared/services/breadcrumb.service';
import {takeUntil} from 'rxjs/operators';
import {DateFacade} from '../../../../store/facade/date.facade';
import {DateSelection} from '../../../../shared/models/date-selection/date-selection';

@Component({
  selector: 'app-widget-wrapper',
  templateUrl: './widget-wrapper.component.html',
  styleUrls: ['./widget-wrapper.component.scss']
})
export class WidgetWrapperComponent implements OnInit, OnDestroy {
  @ViewChild(WidgetDirective, { static: true }) widgetDirective: WidgetDirective;
  // @ViewChild('noData', {static: true}) noDataContainer: TemplateRef<any>;

  filterLoading = true;
  dataLoading = false;
  dataError = false;

  widgets: Widget[] = [];
  isRange: boolean;

  private destroyed$ = new Subject();

  constructor(
    private widgetFacade: WidgetFacade,
    private filterFacade: FilterFacade,
    private dateFacade: DateFacade,
    private groupFacade: GroupFacade,
    private componentFactoryResolver: ComponentFactoryResolver,
    private widgetTypeService: WidgetTypeService,
    private breadcrumbService: BreadcrumbService,
  ) { }

  ngOnInit(): void {
    this.breadcrumbService.pushBreadcrumb({name: 'Widgets', path: '/app/widgets'});

    return;
    this.filterFacade.isLoading$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(loading => this.filterLoading = loading);
    this.widgetFacade.isLoading$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(loading => this.dataLoading = loading);
    this.widgetFacade.hasError$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(err => this.dataError = err);

    this.groupFacade.getCurrentGroup$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(group => this.filterFacade.loadFilterData(group));
    this.filterFacade.getAvailableDates$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(dates => {
      if (!dates) {
        return;
      }
      this.dateFacade.setDateSelection(new DateSelection(
        dates[0].date,
        null,
        false
      ));
    });

    combineLatest([
      this.groupFacade.getCurrentGroup$(),
      this.filterFacade.getUpdates$(),
    ]).pipe(
      takeUntil(this.destroyed$),
    ).subscribe(([group, filterState]) => {
      if (!group || !filterState.dateSelection) {
        return;
      }

      this.widgetFacade.refreshData(filterState.dateSelection, group, filterState.peopleTypes, filterState.groupTypes).then(() => {
        this.dataLoading = false;
      });
    });

    combineLatest([
      this.widgetFacade.getWidgetData$(),
      this.dateFacade.getDateSelection$(),
    ]).pipe(
      takeUntil(this.destroyed$),
    ).subscribe(([widgetData, dateSelection]) => {
      if (!widgetData[0].data || !dateSelection) {
        return;
      }

      this.widgets = widgetData;
      this.isRange = dateSelection.isRange;
      this.initWidgets(this.isRange);
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  initWidgets(isRange: boolean) {
    this.widgetDirective.viewContainerRef.clear();

    for (const widget of this.widgets) {
      if (isRange && !widget.supportsRange) {
        continue;
      }
      if (!isRange && !widget.supportsDate) {
        continue;
      }
      if (widget.data.length === 0 && !widget.allowEmpty) {
        // const viewRef = this.widgetDirective.viewContainerRef.createEmbeddedView(this.noDataContainer);
        // viewRef.rootNodes[0].style.gridArea = widget.uid;
        continue;
      }
      const type = this.widgetTypeService.getTypeFor(widget.className);
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory<WidgetComponent>(type);
      const component = this.widgetDirective.viewContainerRef.createComponent<WidgetComponent>(componentFactory);
      component.instance.chartData = widget.data;
      component.instance.isRange = isRange;
      component.location.nativeElement.style.gridArea = widget.uid;
    }
  }
}
