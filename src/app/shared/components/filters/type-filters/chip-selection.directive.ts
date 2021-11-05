import {Directive, ElementRef, HostListener, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appChipSelection]'
})
export class ChipSelectionDirective implements OnInit {
  @Input() selected: boolean;
  @Input() highlightColor: string;
  @Input() defaultColor = 'white';
  @Input() indicator: HTMLSpanElement;
  @Input() disabled: boolean;

  constructor(private el: ElementRef) { }

  @HostListener('click') onClick() {
    if (this.disabled) {
      return;
    }
    this.update(this.highlightColor);
  }

  ngOnInit(): void {
    this.init(this.highlightColor);
  }

  private init(color: string) {
    if (this.selected) {
      this.el.nativeElement.style.backgroundColor = color;
      this.indicator.style.backgroundColor = this.defaultColor;
      this.el.nativeElement.style.color = this.defaultColor;
      return;
    }
    this.el.nativeElement.style.backgroundColor = this.defaultColor;
    this.indicator.style.backgroundColor = color;
    this.el.nativeElement.style.color = this.highlightColor;
  }

  private update(color: string) {
    if (this.selected) {
      this.el.nativeElement.style.backgroundColor = this.defaultColor;
      this.indicator.style.backgroundColor = color;
      this.el.nativeElement.style.color = this.highlightColor;
      return;
    }
    this.el.nativeElement.style.backgroundColor = color;
    this.indicator.style.backgroundColor = this.defaultColor;
    this.el.nativeElement.style.color = this.defaultColor;
  }
}
