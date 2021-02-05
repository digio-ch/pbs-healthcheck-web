import {Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[appGroupTypeColor]'
})
export class GroupTypeColorDirective implements OnInit, OnChanges {

  @Input() groupTypeColor: string;
  @Input() isSelected: boolean;

  constructor(
    private element: ElementRef
  ) { }

  ngOnInit(): void {
    this.update();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  private update() {
    if (this.isSelected) {
      this.element.nativeElement.style.backgroundColor = this.groupTypeColor;
      this.element.nativeElement.style.border = '2px dashed transparent';
      return;
    }
    this.element.nativeElement.style.backgroundColor = 'transparent';
    this.element.nativeElement.style.border = '2px dashed ' + this.groupTypeColor;
  }
}
