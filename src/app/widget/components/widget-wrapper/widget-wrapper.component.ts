import {
  Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import {WidgetFacade} from '../../../store/facade/widget.facade';
import {FilterFacade} from '../../../store/facade/filter.facade';
import {WidgetDirective} from './widget.directive';
import {WidgetTypeService} from '../../services/widget-type.service';
import {Widget} from '../../../shared/models/widget';
import {WidgetComponent} from '../widgets/widget/widget.component';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {DataFacade} from '../../../store/facade/data.facade';
import {DataProviderService} from '../../../shared/services/data-provider.service';

@Component({
  selector: 'app-widget-wrapper',
  templateUrl: './widget-wrapper.component.html',
  styleUrls: ['./widget-wrapper.component.scss']
})
export class WidgetWrapperComponent implements OnInit, OnDestroy {
  @ViewChild(WidgetDirective, { static: true }) widgetDirective: WidgetDirective;
  // @ViewChild('noData', {static: true}) noDataContainer: TemplateRef<any>;
  private subscriptions: Subscription[] = [];
  widgets: Widget[] = [];
  isRange: boolean;

  dataHandler: DataProviderService;

  constructor(
    private widgetFacade: WidgetFacade,
    private filterFacade: FilterFacade,
    private dataFacade: DataFacade,
    private componentFactoryResolver: ComponentFactoryResolver,
    private widgetTypeService: WidgetTypeService
  ) { }

  ngOnInit(): void {
    this.dataHandler = this.widgetFacade;

    this.subscriptions.push(this.dataHandler.getData$().subscribe(data => {
      if (!data) {
        return;
      }
      this.widgets = this.widgetFacade.getWidgetsSnapshot();
      this.isRange = this.filterFacade.getDateSelectionSnapshot().isRange;
      this.initWidgets(this.isRange);
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
      if (widget.data.length === 0) {
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
