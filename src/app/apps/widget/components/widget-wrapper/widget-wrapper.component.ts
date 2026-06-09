import {
  AfterViewInit,
  Component,
  Input, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef
} from '@angular/core';
import _default from "chart.js/dist/plugins/plugin.tooltip";
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { WidgetFilterComponent } from '../../../../shared/components/filters/widget-filter/widget-filter.component';
import { GroupType } from "../../../../shared/models/group-type";
import { Widget } from '../../../../shared/models/widget';
import { DateFacade } from '../../../../store/facade/date.facade';
import { DefaultFilterFacade } from '../../../../store/facade/default-filter.facade';
import { GroupFacade } from "../../../../store/facade/group.facade";
import { WidgetFacade } from '../../../../store/facade/widget.facade';
import { WidgetFilterService } from '../../services/widget-filter.service';
import { PageType, WidgetTypeService } from '../../services/widget-type.service';
import { WidgetComponent } from '../widgets/widget/widget.component';
import { WidgetDirective } from './widget.directive';

@Component({
    selector: 'app-widget-wrapper',
    templateUrl: './widget-wrapper.component.html',
    styleUrls: ['./widget-wrapper.component.scss'],
    standalone: false
})
export class WidgetWrapperComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(WidgetDirective, { static: true }) widgetDirective: WidgetDirective;
  @ViewChild('appWidgetFilter', { read: ViewContainerRef}) widgetFilter: ViewContainerRef;

  /**
   * Defines which widgets are being displayed
   */
  @Input() pageType: PageType;
  @Input() settingsView: TemplateRef<any>;

  widgets: Widget[] = [];
  isRange: boolean;
  supportsRange: boolean;
  supportsDateSelect: boolean;
  displaySettings: boolean;
  private filterKey: string;

  private destroyed$ = new Subject();

  constructor(
    private widgetFacade: WidgetFacade,
    private filterFacade: DefaultFilterFacade,
    private dateFacade: DateFacade,
    private widgetTypeService: WidgetTypeService,
    private widgetFilterService: WidgetFilterService,
    private dialogService: DialogService,
    private groupFacade: GroupFacade,
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
    const isCantonal = this.groupFacade.getCurrentGroupSnapshot().groupType.groupType === GroupType.CANTONAL_KEY;
    if (this.pageType === 'overview' || this.pageType === 'overview-department' && !isCantonal) {
      this.displaySettings = true;
    }

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
      this.widgetFilter.createComponent<WidgetFilterComponent>(type);
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
      const component = this.widgetDirective.viewContainerRef.createComponent<WidgetComponent>(type);
      component.instance.chartData = widget.data;
      component.instance.isRange = isRange;
      component.location.nativeElement.style.gridArea = widget.uid;
    }
  }

  openSettings() {
    this.dialogService.open(this.settingsView);
  }

  ngAfterViewInit() {
    this.initFilter();
  }
}
