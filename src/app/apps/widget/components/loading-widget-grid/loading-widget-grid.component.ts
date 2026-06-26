import { AfterViewInit, Component, ElementRef, ViewChild, computed, inject, input } from '@angular/core';
import { WidgetFacade } from '../../../../store/facade/widget.facade';
import { WidgetGridDirective } from '../widget-wrapper/widget-grid.directive';
import { PageType } from '../../services/widget-type.service';

// TODO: use this component in the widget wrapper

@Component({
    selector: 'app-loading-widget-grid',
    templateUrl: './loading-widget-grid.component.html',
    styleUrls: ['./loading-widget-grid.component.scss'],
    imports: [WidgetGridDirective]
})
export class LoadingWidgetGridComponent implements AfterViewInit {
  private widgetFacade = inject(WidgetFacade);

  readonly pageType = input.required<PageType>();

  @ViewChild('loadingGridContainer', { static: true}) gridContainer: ElementRef;
  
  readonly widgets = computed(() => {
    return this.widgetFacade.getWidgets(this.pageType());
  })

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
