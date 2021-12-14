import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appTab]'
})
export class TabDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
