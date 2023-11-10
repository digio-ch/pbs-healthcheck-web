import {Inject, Injectable, Type} from '@angular/core';
import {WidgetFilterComponent} from '../../../shared/components/filters/widget-filter/widget-filter.component';
import {WidgetComponent} from '../components/widgets/widget/widget.component';

@Injectable({
  providedIn: 'root'
})
export class WidgetFilterService {

  private filterRegistry = new Map<string, Type<WidgetFilterComponent>>();
  constructor(@Inject('filters') filters) {
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
