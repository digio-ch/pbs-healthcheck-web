import {
  AfterViewInit,
  Component, ComponentFactoryResolver, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import {WidgetFacade} from '../../../../store/facade/widget.facade';
import {DefaultFilterFacade} from '../../../../store/facade/default-filter.facade';
import {WidgetDirective} from './widget.directive';
import {PageType, WidgetTypeService} from '../../services/widget-type.service';
import {Widget} from '../../../../shared/models/widget';
import {WidgetComponent} from '../widgets/widget/widget.component';
import {combineLatest, Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DateFacade} from '../../../../store/facade/date.facade';
import {WidgetFilterService} from '../../services/widget-filter.service';
import {WidgetFilterComponent} from '../../../../shared/components/filters/widget-filter/widget-filter.component';

@Component({
  selector: 'app-widget-wrapper',
  templateUrl: './widget-wrapper.component.html',
  styleUrls: ['./widget-wrapper.component.scss']
})
export class WidgetWrapperComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(WidgetDirective, { static: true }) widgetDirective: WidgetDirective;
  @ViewChild('appWidgetFilter', { read: ViewContainerRef}) widgetFilter: ViewContainerRef;
  // @ViewChild('noData', {static: true}) noDataContainer: TemplateRef<any>;

  /**
   * Defines which widgets are being displayed
   */
  @Input() pageType: PageType;
  
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
    private componentFactoryResolver: ComponentFactoryResolver,
    private widgetTypeService: WidgetTypeService,
    private widgetFilterService: WidgetFilterService,
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
    this.supportsRange = this.widgetTypeService.getRangeSupport(this.pageType);
    this.filterKey = this.widgetTypeService.getFilter(this.pageType);
    this.supportsDateSelect = this.widgetTypeService.getSupportsDateSelect(this.pageType);

    // update the filter and widgets when the data changes
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
