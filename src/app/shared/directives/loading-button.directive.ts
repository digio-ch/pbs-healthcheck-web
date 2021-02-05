import {Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[appLoadingButton]'
})
export class LoadingButtonDirective implements OnInit, OnChanges {

  @Input() loading: boolean;
​
  private spinner: Element;
  private child: Element;
​
  constructor(
    private element: ElementRef,
    private renderer: Renderer2
  ) { }
​
  ngOnInit(): void {
    this.spinner = document.createElement('div');
    this.spinner.className = 'ld ld-ring ld-spin';

    const parent = document.createElement('div');
    parent.className = 'lds-ring';
    this.spinner.appendChild(parent);

    for (let i = 0; i < 4; i++) {
      parent.appendChild(document.createElement('div'));
    }

    this.child = this.element.nativeElement.querySelector('.mat-button-wrapper');
    this.update();
  }
​
  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }
​
  private update() {
    if (!this.spinner) {
      return;
    }
    if (this.loading) {
      this.renderer.appendChild(this.element.nativeElement, this.spinner);
      this.renderer.setStyle(this.child, 'display', 'none');
    } else if (this.spinner.parentElement !== null) {
      this.renderer.removeStyle(this.child, 'display');
      this.renderer.removeChild(this.element.nativeElement, this.spinner, false);
    }
  }

}
