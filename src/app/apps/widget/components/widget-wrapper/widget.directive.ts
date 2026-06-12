import { Directive, ViewContainerRef, inject } from '@angular/core';

@Directive({ selector: '[appWidget]' })
export class WidgetDirective {
  viewContainerRef = inject(ViewContainerRef);
}
