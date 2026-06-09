import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Widget } from '../../../../shared/models/widget';
import { WidgetFacade } from '../../../../store/facade/widget.facade';

@Component({
  selector: 'app-loading-widget-grid',
  templateUrl: './loading-widget-grid.component.html',
  styleUrls: ['./loading-widget-grid.component.scss']
})
export class LoadingWidgetGridComponent implements OnInit, AfterViewInit {
  @ViewChild('loadingGridContainer', { static: true}) gridContainer: ElementRef;
  widgets: Widget[];

  constructor(
    private widgetFacade: WidgetFacade,
  ) { }

  ngOnInit(): void {
    this.widgets = this.widgetFacade.getWidgetsSnapshot();
  }

  ngAfterViewInit(): void {
    // for (let i = 0; i < this.widgets.length; i++) {
    //   const el = this.renderer2.createElement('div');
    //   this.renderer2.setStyle(el, 'grid-area', this.widgets[i].uid);
    //   this.renderer2.setAttribute(el, 'class', 'loading-widget-card');
    //   this.renderer2.appendChild(this.gridContainer.nativeElement, el);
    //   // this.widgetDirective.viewContainerRef.insert(el, i);
    // }
  }


}
