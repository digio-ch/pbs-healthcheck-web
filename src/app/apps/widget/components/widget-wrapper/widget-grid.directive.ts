import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import {GroupFacade} from '../../../../store/facade/group.facade';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Directive({
  selector: '[appWidgetGrid]'
})
export class WidgetGridDirective implements OnInit, OnChanges, OnDestroy {
  @Input() isRange: boolean;
  cols = 'calc(50% - 6px) calc(50% - 6px)';
  dateRows = 'auto 200px 200px 200px 200px';
  rangeRows = 'repeat(4, 200px)';
  rangeArea = '';
  dateArea = '';

  preset: {
    rangeRows: number,
    rangeArea: string,
    dateRows: number,
    dateArea: string,
    smallRangeRows: number,
    smallRangeArea: string,
    smallDateRows: number,
    smallDateArea: string,
  } = {
    rangeRows: 8,
    rangeArea:
      '\'members-gender members-group\'' +
      '\'members-gender members-group\'' +
      '\'camps entered-left\'' +
      '\'camps entered-left\'' +
      '\'role-overview role-overview\'' +
      '\'role-overview role-overview\'' +
      '\'role-overview role-overview\'' +
      '\'role-overview role-overview\'',
    dateRows: 7,
    dateArea:
      '\'leader-overview leader-overview\'' +
      '\'members-gender members-group\'' +
      '\'members-gender members-group\'' +
      '\'age-group-demographic age-group-demographic\'' +
      '\'age-group-demographic age-group-demographic\'' +
      '\'geo-location geo-location\'' +
      '\'geo-location geo-location\'' +
      '\'geo-location geo-location\'' +
      '\'geo-location geo-location\'',
    smallRangeRows: 9,
    smallRangeArea:
      '\'members-gender\'' +
      '\'members-gender\'' +
      '\'members-group\'' +
      '\'members-group\'' +
      '\'camps\'' +
      '\'camps\'' +
      '\'entered-left\'' +
      '\'entered-left\'' +
      '\'role-overview\'',
    smallDateRows: 9,
    smallDateArea:
      '\'leader-overview\'' +
      '\'members-gender\'' +
      '\'members-gender\'' +
      '\'members-group\'' +
      '\'members-group\'' +
      '\'age-group-demographic\'' +
      '\'age-group-demographic\'' +
      '\'geo-location\'' +
      '\'geo-location\'',
  };

  private destroyed$ = new Subject();

  constructor(
    private el: ElementRef,
    private renderer2: Renderer2,
    private groupFacade: GroupFacade
  ) {
  }

  ngOnInit(): void {
    this.initForWidth(window.innerWidth);
    this.processGrid();

    this.groupFacade.getCurrentGroup$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(() => {
      this.initForWidth(window.innerWidth);
      this.processGrid();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.processGrid();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public processGrid() {
    this.renderer2.setStyle(this.el.nativeElement, 'grid-template-columns', this.cols);
    this.renderer2.setStyle(this.el.nativeElement, 'grid-template-rows', this.isRange ? this.rangeRows : this.dateRows);
    this.renderer2.setStyle(this.el.nativeElement, 'grid-template-areas', this.isRange ? this.rangeArea : this.dateArea);
  }

  private initForWidth(width: number) {
    const preset = this.preset;

    if (width >= 765) {
      this.cols = 'calc(50% - 6px) calc(50% - 6px)';
      this.rangeRows = `repeat(${preset.rangeRows}, 200px)`;
      this.dateRows = `auto repeat(${preset.dateRows}, 200px)`;
      this.rangeArea = preset.rangeArea;
      this.dateArea = preset.dateArea;
      return;
    }
    if (width < 765) {
      this.cols = '100%';
      this.rangeRows = `repeat(${preset.smallRangeRows}, 200px)`;
      this.dateRows = `auto repeat(${preset.smallDateRows}, 200px)`;
      this.rangeArea = preset.smallRangeArea;
      this.dateArea = preset.smallDateArea;
      return;
    }
  }

  @HostListener('window:resize', ['$event']) onResize(event) {
    this.initForWidth(event.target.innerWidth);
  }
}
