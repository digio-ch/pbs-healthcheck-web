import { Injectable, Type, inject } from '@angular/core';
import { WidgetFilterComponent } from '../../../shared/components/filters/widget-filter/widget-filter.component';

@Injectable({
  providedIn: 'root'
})
export class WidgetFilterService {

  private filterRegistry = new Map<string, Type<WidgetFilterComponent>>();
  constructor() {
    const filters = inject<any>('filters' as any);

    for (const filter of filters) {
      this.register(filter.FILTER_CLASS_NAME, filter);
    }
  }

  public register(name: string, type: Type<WidgetFilterComponent>): void {
    this.filterRegistry.set(name, type);
  }

  public getTypeFor(name: string): Type<WidgetFilterComponent> {
    return this.filterRegistry.get(name);
  }
}
