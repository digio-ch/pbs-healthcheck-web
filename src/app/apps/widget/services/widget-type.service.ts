import {Inject, Injectable, Type} from '@angular/core';
import {WidgetComponent} from '../components/widgets/widget/widget.component';

@Injectable({
  providedIn: 'root'
})
export class WidgetTypeService {

  private widgetTypeRegistry = new Map<string, Type<WidgetComponent>>();

  constructor(@Inject('widgets') widgets) {
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
}
