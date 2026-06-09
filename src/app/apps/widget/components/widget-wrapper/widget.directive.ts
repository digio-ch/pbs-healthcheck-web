import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appWidget]',
    standalone: false
})
export class WidgetDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
