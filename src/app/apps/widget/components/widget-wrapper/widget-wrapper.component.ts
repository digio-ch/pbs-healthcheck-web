import {
  AfterViewInit,
  Component, ComponentFactoryResolver, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import {WidgetFacade} from '../../../../store/facade/widget.facade';
import {DefaultFilterFacade} from '../../../../store/facade/default-filter.facade';
import {WidgetDirective} from './widget.directive';
import {WidgetTypeService} from '../../services/widget-type.service';
import {Widget} from '../../../../shared/models/widget';
import {WidgetComponent} from '../widgets/widget/widget.component';
import {combineLatest, Observable, Subject} from 'rxjs';
import {GroupFacade} from '../../../../store/facade/group.facade';
import {BreadcrumbService} from '../../../../shared/services/breadcrumb.service';
import {first, takeUntil, tap} from 'rxjs/operators';
import {DateFacade} from '../../../../store/facade/date.facade';
import {WidgetService} from '../../services/widget.service';
import {bootstrapApplication} from '@angular/platform-browser';
import {WidgetFilterService} from '../../services/widget-filter.service';
import {WidgetFilterComponent} from '../../../../shared/components/filters/widget-filter/widget-filter.component';
import {TypeFiltersComponent} from '../../../../shared/components/filters/type-filters/type-filters.component';
import {MembersGroupComponent} from '../widgets/members-group/members-group.component';
import {CensusFilterService} from '../../../../store/services/census-filter.service';

@Component({
  selector: 'app-widget-wrapper',
  templateUrl: './widget-wrapper.component.html',
  styleUrls: ['./widget-wrapper.component.scss']
})
export class WidgetWrapperComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(WidgetDirective, { static: true }) widgetDirective: WidgetDirective;
  @ViewChild('appWidgetFilter', { read: ViewContainerRef}) widgetFilter: ViewContainerRef;
  // @ViewChild('noData', {static: true}) noDataContainer: TemplateRef<any>;

  widgets: Widget[] = [];
  isRange: boolean;
  supportsRange: boolean;
  supportsDateSelect: boolean;
  private filterKey: string;

  private destroyed$ = new Subject();

  constructor(
    private widgetFacade: WidgetFacade,
    private filterFacade: DefaultFilterFacade,
    private dateFacade: DateFacade,
    private groupFacade: GroupFacade,
    private componentFactoryResolver: ComponentFactoryResolver,
    private widgetTypeService: WidgetTypeService,
    private widgetService: WidgetService,
    private widgetFilterService: WidgetFilterService,
    private censusFilterService: CensusFilterService,
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
    this.supportsRange = this.widgetTypeService.getRangeSupportForRoute();
    this.filterKey = this.widgetTypeService.getFilterForRoute();
    this.supportsDateSelect = this.widgetTypeService.getSupportsDateSelect();
    let updateCause = 0;
    combineLatest([
      this.groupFacade.getCurrentGroup$().pipe(
        tap(() => updateCause = 1),
      ),
      this.filterFacade.getUpdates$().pipe(
        tap(() => updateCause = 2),
      ),
      this.censusFilterService.getUpdates$().pipe(
        tap(() => updateCause = 2)
      ),
    ]).pipe(
      takeUntil(this.destroyed$),
    ).subscribe(([group, filterState, censusFilterState]) => {
      const filterInitialized = this.filterFacade.isInitialized();
      if (updateCause === 1 || !filterInitialized) {
        this.filterFacade.loadFilterData(group).pipe(
          first(),
        ).subscribe();
      } else if (updateCause === 2) {
        this.widgetFacade.refreshData(filterState.dateSelection, group, filterState.peopleTypes, filterState.groupTypes, censusFilterState);
      }
    });

    combineLatest([
      this.widgetFacade.getWidgetData$(),
      this.dateFacade.getDateSelection$(),
    ]).pipe(
      takeUntil(this.destroyed$),
    ).subscribe(([widgetData, dateSelection]) => {
      if (!dateSelection) {
        return;
      }

      this.widgets = widgetData;
      this.isRange = dateSelection.isRange;
      this.initFilter();
      this.initWidgets(this.isRange);
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  initFilter() {
    setTimeout(() => {
      this.widgetFilter.clear();
      const type = this.widgetFilterService.getTypeFor(this.filterKey);
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory<WidgetFilterComponent>(type);
      const component = this.widgetFilter.createComponent<WidgetFilterComponent>(componentFactory);
    }, 1);
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
      if ((!widget.data || widget.data.length === 0) && !widget.allowEmpty) {
        // const viewRef = this.widgetDirective.viewContainerRef.createEmbeddedView(this.noDataContainer);
        // viewRef.rootNodes[0].style.gridArea = widget.uid;
        continue;
      }
      console.log(widget.className);
      const type = this.widgetTypeService.getTypeFor(widget.className);
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory<WidgetComponent>(type);
      const component = this.widgetDirective.viewContainerRef.createComponent<WidgetComponent>(componentFactory);
      component.instance.chartData = widget.data;
      component.instance.isRange = isRange;
      component.location.nativeElement.style.gridArea = widget.uid;
    }
  }

  ngAfterViewInit() {
    this.initFilter();
  }
}
