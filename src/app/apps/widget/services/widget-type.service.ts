import { Inject, Injectable, Type } from '@angular/core';
import { WidgetComponent } from '../components/widgets/widget/widget.component';

export type PageType = 'overview' | 'overview-department' | 'census';

type WidgetsPreset = {
  filter: string,
  supportsRange?: boolean,
  supportsDateSelect?: boolean,
  localFilter?: boolean,
  rangeRows?: number,
  rangeArea?: string,
  dateRows: number,
  dateArea: string,
  smallRangeRows?: number,
  smallRangeArea?: string,
  smallDateRows: number,
  smallDateArea: string,
};

@Injectable({
  providedIn: 'root'
})
export class WidgetTypeService {

  types: Record<PageType, WidgetsPreset> = {
    'overview': {
      filter: 'default-filter',
      supportsRange: true,
      rangeRows: 7,
      rangeArea:
        '\'role-overview role-overview\'' +
        '\'role-overview role-overview\'' +
        '\'role-overview role-overview\'' +
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
      smallRangeRows: 12,
      smallRangeArea:
        '\'role-overview role-overview\'' +
        '\'role-overview role-overview\'' +
        '\'role-overview role-overview\'' +
        '\'role-overview role-overview\'' +
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
    },
    'overview-department': {
      filter: 'default-filter',
      supportsRange: true,
      rangeRows: 7,
      rangeArea:
        '\'role-overview role-overview\'' +
        '\'role-overview role-overview\'' +
        '\'role-overview role-overview\'' +
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
      smallRangeRows: 12,
      smallRangeArea:
        '\'role-overview role-overview\'' +
        '\'role-overview role-overview\'' +
        '\'role-overview role-overview\'' +
        '\'role-overview role-overview\'' +
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
    },
    'census': {
      filter: 'census-filter',
      localFilter: false,
      supportsDateSelect: false,
      dateRows: 7,
      dateArea:
        '\'census-table census-table\'' +
        '\'census-table census-table\'' +
        '\'census-development census-development\'' +
        '\'census-development census-development\'' +
        '\'census-members census-members\'' +
        '\'census-members census-members\'' +
        '\'census-treemap census-treemap\'' +
        '\'census-treemap census-treemap\'',
      smallDateRows: 9,
      smallDateArea:
        '\'census-table\'' +
        '\'census-table\'' +
        '\'census-development\'' +
        '\'census-development\'' +
        '\'census-members\'' +
        '\'census-members\'' +
        '\'census-treemap\'' +
        '\'census-treemap\'',
    }
  }

  private widgetTypeRegistry = new Map<string, Type<WidgetComponent>>();

  constructor(
    @Inject('widgets') widgets,
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


  getWidgetsPreset(type: PageType) {
    return this.types[type];
  }

  getRangeSupport(type: PageType) {
    return this.types[type].supportsRange;
  }

  getFilter(type: PageType) {
    return this.types[type].filter;
  }

  getSupportsDateSelect(type: PageType) {
    const supportsDateSelect = this.types[type].supportsDateSelect;
    return supportsDateSelect !== undefined ? supportsDateSelect : true;
  }
}
