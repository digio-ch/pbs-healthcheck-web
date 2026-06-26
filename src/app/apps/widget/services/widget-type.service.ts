import { Injectable, Type, inject } from '@angular/core';
import { WidgetComponent } from '../components/widgets/widget/widget.component';

export type PageType = 'overview' | 'overview-department' | 'census' | 'my-organization';

type WidgetsPreset = {
  supportsRange?: boolean,
  supportsDateSelect?: boolean,
  rangeRows?: number,
  /**
   * specifies the grid layout (grid-template-areas) when a date range is selected
   */
  rangeArea?: string,
  dateRows: number,
  /**
   * specifies the grid layout (grid-template-areas) when a single date is selected
   */
  dateArea: string,
  smallRangeRows?: number,
  /**
   * same as {@link WidgetsPreset.rangeArea} but for a smaller screen
   */
  smallRangeArea?: string,
  smallDateRows: number,
  /**
   * same as {@link WidgetsPreset.rangeArea} but for a smaller screen
   */
  smallDateArea: string,
};
@Injectable({
  providedIn: 'root'
})
export class WidgetTypeService {
  
  /*
  * TODO: fix WidgetsPreset structure
  * - move layout into own struct
  * - find a better way to define area and then compile it to css
  */

  readonly types: Record<PageType, WidgetsPreset> = {
    'overview': {
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
    },
    'my-organization': {
      supportsRange: true,
      supportsDateSelect: true,
      dateRows: 4,
      dateArea: 
        '\'. .\'' + // ignore the "auto" template row
        '\'gender-stats stage-stats\'' +
        '\'gender-stats stage-stats\'' +
        '\'demographic-stats demographic-stats\'' +
        '\'demographic-stats demographic-stats\'',
      rangeRows: 2,
      rangeArea: 
        '\'gender-stats stage-stats\'' +
        '\'gender-stats stage-stats\'',
      smallDateRows: 6,
      smallDateArea: 
        '\'.\'' + // ignore the "auto" template row
        '\'gender-stats\'' +
        '\'gender-stats\'' +
        '\'stage-stats\'' +
        '\'stage-stats\'' +
        '\'demographic-stats\'' +
        '\'demographic-stats\'',
      smallRangeRows: 4,
      smallRangeArea: 
        '\'gender-stats\'' +
        '\'gender-stats\'' +
        '\'stage-stats\'' +
        '\'stage-stats\'',
    }
  }

  private widgetTypeRegistry = new Map<string, Type<WidgetComponent>>();

  constructor() {
    const widgets = inject<any>('widgets' as any);

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

  getSupportsDateSelect(type: PageType) {
    const supportsDateSelect = this.types[type].supportsDateSelect;
    return supportsDateSelect !== undefined ? supportsDateSelect : true;
  }
}
