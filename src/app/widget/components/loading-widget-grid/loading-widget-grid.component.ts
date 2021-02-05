import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {WidgetFacade} from '../../../store/facade/widget.facade';
import {Widget} from '../../../shared/models/widget';
import {WidgetDirective} from '../widget-wrapper/widget.directive';

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
    private renderer2: Renderer2
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
