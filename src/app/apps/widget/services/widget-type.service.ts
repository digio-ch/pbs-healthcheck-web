import {Inject, Injectable, Type} from '@angular/core';
import {WidgetComponent} from '../components/widgets/widget/widget.component';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WidgetTypeService {


  presets: preset[] = [{
    path: 'health',
    filter: 'default-filter',
    supportsRange: true,
    rangeRows: 4,
    rangeArea:
      '\'members-gender members-group\'' +
      '\'members-gender members-group\'' +
      '\'camps entered-left\'' +
      '\'camps entered-left\'',
    dateRows: 7,
    dateArea:
      '\'leader-overview leader-overview\'' +
      '\'members-gender members-group\'' +
      '\'members-gender members-group\'' +
      '\'age-group-demographic age-group-demographic\'' +
      '\'age-group-demographic age-group-demographic\'' +
      '\'geo-location geo-location\'' +
      '\'geo-location geo-location\'' +
      '\'geo-location geo-location\'' +
      '\'geo-location geo-location\'',
    smallRangeRows: 8,
    smallRangeArea:
      '\'members-gender\'' +
      '\'members-gender\'' +
      '\'members-group\'' +
      '\'members-group\'' +
      '\'camps\'' +
      '\'camps\'' +
      '\'entered-left\'' +
      '\'entered-left\'',
    smallDateRows: 9,
    smallDateArea:
      '\'leader-overview\'' +
      '\'members-gender\'' +
      '\'members-gender\'' +
      '\'members-group\'' +
      '\'members-group\'' +
      '\'age-group-demographic\'' +
      '\'age-group-demographic\'' +
      '\'geo-location\'' +
      '\'geo-location\'',
  }];

  private widgetTypeRegistry = new Map<string, Type<WidgetComponent>>();

  constructor(
    @Inject('widgets') widgets,
    private router: Router
  ) {
    for (const widgetClass of widgets) {
      this.register(widgetClass.WIDGET_CLASS_NAME, widgetClass);
    }
  }

  public register(name: string, type: Type<WidgetComponent>): void {
    this.widgetTypeRegistry.set(name, type);
  }

  public getTypeFor(name: string): Type<WidgetComponent> {
    return this.widgetTypeRegistry.get(name);
  }


  getPresetForRoute() {
    const widgetPath = this.router.url.split('/').slice(-1)[0]; // Should be replaced with route data in the future.
    for (const p of this.presets) {
      if (widgetPath === p.path) {
        return p;
      }
    }
    return null;
  }

  getRangeSupportForRoute() {
    return this.getPresetForRoute().supportsRange;
  }

  getFilterForRoute() {
    return this.getPresetForRoute().filter;
  }
}

type preset = {
  path: string,
  filter: string,
  supportsRange?: boolean,
  rangeRows?: number,
  rangeArea?: string,
  dateRows: number,
  dateArea: string,
  smallRangeRows?: number,
  smallRangeArea?: string,
  smallDateRows: number,
  smallDateArea: string,
};
