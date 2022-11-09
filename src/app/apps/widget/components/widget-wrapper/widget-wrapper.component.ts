import {
  Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import {WidgetFacade} from '../../../../store/facade/widget.facade';
import {FilterFacade} from '../../../../store/facade/filter.facade';
import {WidgetDirective} from './widget.directive';
import {WidgetTypeService} from '../../services/widget-type.service';
import {Widget} from '../../../../shared/models/widget';
import {WidgetComponent} from '../widgets/widget/widget.component';
import {combineLatest, Observable, Subject} from 'rxjs';
import {GroupFacade} from '../../../../store/facade/group.facade';
import {BreadcrumbService} from '../../../../shared/services/breadcrumb.service';
import {first, takeUntil, tap} from 'rxjs/operators';
import {DateFacade} from '../../../../store/facade/date.facade';

@Component({
  selector: 'app-widget-wrapper',
  templateUrl: './widget-wrapper.component.html',
  styleUrls: ['./widget-wrapper.component.scss']
})
export class WidgetWrapperComponent implements OnInit, OnDestroy {
  @ViewChild(WidgetDirective, { static: true }) widgetDirective: WidgetDirective;
  // @ViewChild('noData', {static: true}) noDataContainer: TemplateRef<any>;

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

  get loading$(): Observable<boolean> {
    return this.widgetFacade.isLoading$();
  }

  get filterLoading$(): Observable<boolean> {
    return this.filterFacade.isLoading$();
  }

  get error$(): Observable<boolean> {
    return this.widgetFacade.hasError$();
  }

  ngOnInit(): void {
    this.breadcrumbService.pushBreadcrumb({name: 'Widgets', path: '/app/widgets'});

    let updateCause = 0;
    combineLatest([
      this.groupFacade.getCurrentGroup$().pipe(
        tap(() => updateCause = 1),
      ),
      this.filterFacade.getUpdates$().pipe(
        tap(() => updateCause = 2),
      ),
    ]).pipe(
      takeUntil(this.destroyed$),
    ).subscribe(([group, filterState]) => {
      const filterInitialized = this.filterFacade.isInitialized();
      if (updateCause === 1 || !filterInitialized) {
        this.filterFacade.loadFilterData(group).pipe(
          first(),
        ).subscribe();
      } else if (updateCause === 2) {
        this.widgetFacade.refreshData(filterState.dateSelection, group, filterState.peopleTypes, filterState.groupTypes);
      }
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
