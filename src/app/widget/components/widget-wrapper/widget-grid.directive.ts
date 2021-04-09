import {Directive, ElementRef, HostListener, Input, OnChanges, OnInit, Renderer2, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[appWidgetGrid]'
})
export class WidgetGridDirective implements OnInit, OnChanges {
  @Input() isRange: boolean;
  cols = 'calc(50% - 6px) calc(50% - 6px)';
  dateRows = 'auto 200px 200px 200px 200px';
  rangeRows = 'repeat(4, 200px)';
  rangeArea: string =
    "'members-gender members-group'" +
    "'members-gender members-group'" +
    "'camps entered-left'" +
    "'camps entered-left'";
  dateArea: string =
    "'leader-overview leader-overview'" +
    "'members-gender members-group'" +
    "'members-gender members-group'" +
    "'age-group-demographic age-group-demographic'" +
    "'age-group-demographic age-group-demographic'" +
    "'geo-location geo-location'" +
    "'geo-location geo-location'";

  constructor(
    private el: ElementRef,
    private renderer2: Renderer2
  ) { }

  ngOnInit(): void {
    this.initForWidth(window.innerWidth);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.processGrid();
  }

  public processGrid() {
    this.renderer2.setStyle(this.el.nativeElement, 'grid-template-columns', this.cols);
    this.renderer2.setStyle(this.el.nativeElement, 'grid-template-rows', this.isRange ? this.rangeRows : this.dateRows);
    this.renderer2.setStyle(this.el.nativeElement, 'grid-template-areas', this.isRange ? this.rangeArea : this.dateArea);
  }

  private initForWidth(width: number) {
    if (width > 765) {
      this.cols = 'calc(50% - 6px) calc(50% - 6px)';
      this.dateRows = 'auto 200px 200px 200px 200px';
      this.rangeRows = 'repeat(4, 200px)';
      this.rangeArea =
        "'members-gender members-group'" +
        "'members-gender members-group'" +
        "'camps entered-left'" +
        "'camps entered-left'";
      this.dateArea =
        "'leader-overview leader-overview'" +
        "'members-gender members-group'" +
        "'members-gender members-group'" +
        "'age-group-demographic age-group-demographic'" +
        "'age-group-demographic age-group-demographic'" +
        "'geo-location geo-location'" +
        "'geo-location geo-location'";
      this.processGrid();
      return;
    }
    if (width < 765) {
      this.cols = '100%';
      this.dateRows = 'auto repeat(6, 200px)';
      this.rangeRows = 'repeat(8, 200px)';
      this.rangeArea =
        "'members-gender'" +
        "'members-gender'" +
        "'members-group'" +
        "'members-group'" +
        "'camps'" +
        "'camps'" +
        "'entered-left'" +
        "'entered-left'";
      this.dateArea =
        "'leader-overview'" +
        "'members-gender'" +
        "'members-gender'" +
        "'members-group'" +
        "'members-group'" +
        "'age-group-demographic'" +
        "'age-group-demographic'" +
        "'geo-location'" +
        "'geo-location'";
      this.processGrid();
      return;
    }
  }

  @HostListener('window:resize', ['$event']) onResize(event) {
    this.initForWidth(event.target.innerWidth);
  }
}
