import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  ViewEncapsulation
} from '@angular/core';
import {BarVerticalStackedComponent} from '@swimlane/ngx-charts';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-positive-stacked-bar-chart',
  templateUrl: './positive-stacked-bar-chart.component.html',
  styleUrls: ['./positive-stacked-bar-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animationState', [
      transition(':leave', [
        style({
          opacity: 1,
          transform: '*'
        }),
        animate(500, style({ opacity: 0, transform: 'scale(0)' }))
      ])
    ])
  ]
})
export class PositiveStackedBarChartComponent extends BarVerticalStackedComponent implements AfterViewInit {
  constructor(
    protected chartElement: ElementRef,
    protected zone: NgZone,
    protected cd: ChangeDetectorRef,
    private elRef: ElementRef
  ) {
    super(chartElement, zone, cd);
  }

  ngAfterViewInit() {
    const lines = this.elRef.nativeElement.querySelectorAll('line');
    const middleLine = lines[(lines.length - 1) / 2];
    middleLine.style.stroke = '#000000';
    middleLine.style.strokeWidth = '2px';
    super.ngAfterViewInit();
  }

  onActivate(event: any, group: any, fromLegend?: boolean) {
    const item = Object.assign({}, event);
    if (group) {
      item.series = group.name;
    }

    const items = this.results
      .map(g => g.series)
      .flat()
      .filter(i => {
        if (fromLegend) {
          return i.label === item.name;
        } else {
          return i.name === item.name && i.series === item.series && i.value === item.value;
        }
      });

    this.activeEntries = [...items];
    this.activate.emit({ value: item, entries: this.activeEntries });
  }

  getValueDomain() {
    const domain = [];
    let smallest = 0;
    let biggest = 0;
    for (const group of this.results) {
      let smallestSum = 0;
      let biggestSum = 0;
      for (const d of group.series) {
        if (d.value < 0) {
          smallestSum += d.value;
        } else {
          biggestSum += d.value;
        }
        smallest = d.value < smallest ? d.value : smallest;
        biggest = d.value > biggest ? d.value : biggest;
      }
      domain.push(smallestSum);
      domain.push(biggestSum);
    }
    domain.push(smallest);
    domain.push(biggest);

    const min = Math.min(...domain) - 1;
    const max = Math.max(...domain) + 1;

    if (Math.abs(min) > max) {
      return [min, Math.abs(min)];
    }

    return [(0 - max), max];
  }

}
