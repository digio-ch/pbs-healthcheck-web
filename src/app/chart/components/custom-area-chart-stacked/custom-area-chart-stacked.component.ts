import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChild,
  EventEmitter,
  HostListener,
  Input,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { 
  BaseChartComponent,
  calculateViewDimensions,
  Color,
  ColorHelper,
  getScaleType,
  getUniqueXDomainValues,
  id,
  LegendOptions,
  LegendPosition,
  NgxChartsModule,
  Orientation,
  ScaleType,
  SeriesType,
  ViewDimensions 
} from '@swimlane/ngx-charts';
import { scaleTime, scaleLinear, scalePoint } from 'd3-scale';
import { curveLinear } from 'd3-shape';

/**
 * Represents a stacked area chart with support for a line chart on top that uses the second y axis.
 * 
 * Unfortunately, the chart package (@swimlane/ngx-charts) does not support charts with a second y-axis. \
 * However, the package supports custom chart implementations using the public API of the package. \
 * Most of this component is copied from {@link https://github.com/swimlane/ngx-charts/blob/133e2823d07b428a3d194971751aca870ed2948a/projects/swimlane/ngx-charts/src/lib/area-chart/area-chart-stacked.component.ts}
 */
@Component({
  selector: 'app-custom-area-chart-stacked',
  imports: [NgxChartsModule],
  templateUrl: './custom-area-chart-stacked.component.html',
  styleUrl: './custom-area-chart-stacked.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CustomAreaChartStackedComponent extends BaseChartComponent {
  // inputs for the area chart
  @Input() legend: boolean = false;
  @Input() legendTitle: string = 'Legend';
  @Input() legendPosition: LegendPosition = LegendPosition.Right;
  @Input() xAxis: boolean = false;
  @Input() yAxis: boolean = false;
  @Input() showXAxisLabel: boolean;
  @Input() showYAxisLabel: boolean;
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;
  @Input() timeline: boolean = false;
  @Input() gradient: boolean;
  @Input() showGridLines: boolean = true;
  @Input() curve: any = curveLinear;
  @Input() activeEntries: any[] = [];
  @Input() declare schemeType: ScaleType;
  @Input() trimXAxisTicks: boolean = true;
  @Input() trimYAxisTicks: boolean = true;
  @Input() rotateXAxisTicks: boolean = true;
  @Input() maxXAxisTickLength: number = 16;
  @Input() maxYAxisTickLength: number = 16;
  @Input() xAxisTickFormatting: any;
  @Input() yAxisTickFormatting: any;
  @Input() xAxisTicks: any[];
  @Input() yAxisTicks: any[];
  @Input() roundDomains: boolean = false;
  @Input() tooltipDisabled: boolean = false;
  @Input() xScaleMin: any;
  @Input() xScaleMax: any;
  @Input() yScaleMin: number;
  @Input() yScaleMax: number;
  @Input() wrapTicks = false;

  // inputs for the line chart
  @Input() lineResults: any[] = [];
  @Input() lineScheme: Color;
  @Input() lineShowGridLines: boolean = true;
  @Input() lineShowYAxisLabel: boolean;
  @Input() lineYAxisLabel: string;
  @Input() lineMaxYAxisTickLength: number = 16;
  @Input() lineYAxisTickFormatting: any;
  @Input() lineYScaleMin: number;
  @Input() lineYScaleMax: number;
  @Input() lineRoundDomains: boolean = false;

  @Output() activate: EventEmitter<any> = new EventEmitter();
  @Output() deactivate: EventEmitter<any> = new EventEmitter();

  @ContentChild('tooltipTemplate') tooltipTemplate: TemplateRef<any>;
  @ContentChild('seriesTooltipTemplate') seriesTooltipTemplate: TemplateRef<any>;

  readonly displayRightYAxis = computed(() => {
    return this.lineResults.length > 0;
  });

  dims: ViewDimensions;
  scaleType: ScaleType;
  xDomain: any[];
  xSet: any[]; // the set of all values on the X Axis
  yDomain: [number, number];
  seriesDomain: any;
  xScale: any;
  yScale: any;
  transform: string;
  clipPathId: string;
  clipPath: string;
  colors: ColorHelper;
  margin: number[] = [10, 20, 10, 20];
  hoveredVertical: any; // the value of the x axis that is hovered over
  xAxisHeight: number = 0;
  yAxisWidth: number = 0;
  filteredDomain: any;
  legendOptions: any;

  timelineWidth: number;
  timelineHeight: number = 50;
  timelineXScale: any;
  timelineYScale: any;
  timelineXDomain: any;
  timelineTransform: any;
  timelinePadding: number = 10;

  seriesType = SeriesType;
  yOrientation = Orientation;

  lineYDomain: any[];
  lineSeriesDomain: any[];
  lineYScale: any;
  lineColors: ColorHelper;

  combinedResults = [];
  combinedColors: ColorHelper;

  update(): void {
    super.update();

    this.dims = calculateViewDimensions({
      width: this.width,
      height: this.height,
      margins: this.margin,
      showXAxis: this.xAxis,
      showYAxis: this.yAxis,
      xAxisHeight: this.xAxisHeight,
      yAxisWidth: this.yAxisWidth,
      showXLabel: this.showXAxisLabel,
      showYLabel: this.showYAxisLabel,
      showLegend: this.legend,
      legendType: this.schemeType,
      legendPosition: this.legendPosition
    });

    if (this.timeline) {
      this.dims.height -= this.timelineHeight + this.margin[2] + this.timelinePadding;
    }

    this.xDomain = this.getXDomain();
    if (this.filteredDomain) {
      this.xDomain = this.filteredDomain;
    }

    this.yDomain = this.getYDomain();
    this.seriesDomain = this.getSeriesDomain();

    this.lineYDomain = this.getLineYDomain();
    this.lineSeriesDomain = this.getLineSeriesDomain();

    this.xScale = this.getXScale(this.xDomain, this.dims.width);
    this.yScale = this.getYScale(this.yDomain, this.dims.height);
    this.lineYScale = this.getLineYScale(this.lineYDomain, this.dims.height);

    for (let i = 0; i < this.xSet.length; i++) {
      const val = this.xSet[i];
      let d0 = 0;
      for (const group of this.results) {
        let d = group.series.find(item => {
          let a = item.name;
          let b = val;
          if (this.scaleType === ScaleType.Time) {
            a = a.valueOf();
            b = b.valueOf();
          }
          return a === b;
        });

        if (d) {
          d.d0 = d0;
          d.d1 = d0 + d.value;
          d0 += d.value;
        } else {
          d = {
            name: val,
            value: 0,
            d0,
            d1: d0
          };
          group.series.push(d);
        }
      }
    }

    this.combinedResults = [
      ...this.results,
      ...this.lineResults,
    ];

    this.updateTimeline();

    this.setColors();
    this.setLineColors();
    this.setCombinedColors();
    this.legendOptions = this.getLegendOptions();

    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0]})`;

    this.clipPathId = 'clip' + id().toString();
    this.clipPath = `url(#${this.clipPathId})`;
  }

  updateTimeline(): void {
    if (this.timeline) {
      this.timelineWidth = this.dims.width;
      this.timelineXDomain = this.getXDomain();
      this.timelineXScale = this.getXScale(this.timelineXDomain, this.timelineWidth);
      this.timelineYScale = this.getYScale(this.yDomain, this.timelineHeight);
      this.timelineTransform = `translate(${this.dims.xOffset}, ${-this.margin[2]})`;
    }
  }

  getXDomain(): any[] {
    let values = getUniqueXDomainValues(this.results);

    this.scaleType = getScaleType(values);
    let domain = [];

    if (this.scaleType === ScaleType.Linear) {
      values = values.map(v => Number(v));
    }

    let min;
    let max;
    if (this.scaleType === ScaleType.Time || this.scaleType === ScaleType.Linear) {
      min = this.xScaleMin ? this.xScaleMin : Math.min(...values);

      max = this.xScaleMax ? this.xScaleMax : Math.max(...values);
    }

    if (this.scaleType === ScaleType.Time) {
      domain = [new Date(min), new Date(max)];
      this.xSet = [...values].sort((a, b) => {
        const aDate = a.getTime();
        const bDate = b.getTime();
        if (aDate > bDate) return 1;
        if (bDate > aDate) return -1;
        return 0;
      });
    } else if (this.scaleType === ScaleType.Linear) {
      domain = [min, max];
      // Use compare function to sort numbers numerically
      this.xSet = [...values].sort((a, b) => a - b);
    } else {
      domain = values;
      this.xSet = values;
    }

    return domain;
  }

  getYDomain(): [number, number] {
    const domain = [];

    for (let i = 0; i < this.xSet.length; i++) {
      const val = this.xSet[i];
      let sum = 0;
      for (const group of this.results) {
        const d = group.series.find(item => {
          let a = item.name;
          let b = val;
          if (this.scaleType === ScaleType.Time) {
            a = a.valueOf();
            b = b.valueOf();
          }
          return a === b;
        });

        if (d) {
          sum += d.value;
        }
      }

      domain.push(sum);
    }

    const min = this.yScaleMin ? this.yScaleMin : Math.min(0, ...domain);

    const max = this.yScaleMax ? this.yScaleMax : Math.max(...domain);
    return [min, max];
  }

  getLineYDomain(): [number, number] {
    const domain = [];

    for (let i = 0; i < this.xSet.length; i++) {
      const val = this.xSet[i];
      let sum = 0;
      for (const group of this.lineResults) {
        const d = group.series.find(item => {
          let a = item.name;
          let b = val;
          if (this.scaleType === ScaleType.Time) {
            a = a.valueOf();
            b = b.valueOf();
          }
          return a === b;
        });

        if (d) {
          sum += d.value;
        }
      }

      domain.push(sum);
    }

    const min = this.lineYScaleMin ? this.lineYScaleMin : Math.min(0, ...domain);

    const max = this.lineYScaleMax ? this.lineYScaleMax : Math.max(...domain);
    return [min, max];
  }

  getSeriesDomain(): string[] {
    return this.results.map(d => d.name);
  }

  getLineSeriesDomain(): string[] {
    return this.lineResults.map(d => d.name);
  }

  getXScale(domain, width: number): any {
    let scale;

    if (this.scaleType === ScaleType.Time) {
      scale = scaleTime();
    } else if (this.scaleType === ScaleType.Linear) {
      scale = scaleLinear();
    } else if (this.scaleType === ScaleType.Ordinal) {
      scale = scalePoint().padding(0.1);
    }

    scale.range([0, width]).domain(domain);

    return this.roundDomains ? scale.nice() : scale;
  }

  getYScale(domain, height: number): any {
    const scale = scaleLinear().range([height, 0]).domain(domain);
    return this.roundDomains ? scale.nice() : scale;
  }

  getLineYScale(domain, height: number): any {
    const scale = scaleLinear().range([height, 0]).domain(domain);
    return this.lineRoundDomains ? scale.nice() : scale;
  }

  updateDomain(domain): void {
    this.filteredDomain = domain;
    this.xDomain = this.filteredDomain;
    this.xScale = this.getXScale(this.xDomain, this.dims.width);
  }

  updateHoveredVertical(item) {
    this.hoveredVertical = item.value;
    this.deactivateAll();
  }

  @HostListener('mouseleave')
  hideCircles(): void {
    this.hoveredVertical = null;
    this.deactivateAll();
  }

  onClick(data, series?): void {
    if (series) {
      data.series = series.name;
    }

    this.select.emit(data);
  }

  trackBy(index, item): string {
    return `${item.name}`;
  }

  setColors(): void {
    let domain;
    if (this.schemeType === ScaleType.Ordinal) {
      domain = this.seriesDomain;
    } else {
      domain = this.yDomain;
    }

    this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
  }

  setLineColors(): void {
    let domain;
    if (this.schemeType === ScaleType.Ordinal) {
      domain = this.lineSeriesDomain;
    } else {
      domain = this.lineYDomain;
    }

    this.lineColors = new ColorHelper(this.lineScheme, this.schemeType, domain, this.customColors);
  }

  setCombinedColors(): void {
    let domain;
    if (this.schemeType === ScaleType.Ordinal) {
      domain = [
        ...this.seriesDomain,
        ...this.lineSeriesDomain,
      ]
    } else {
      domain = [
        ...this.yDomain,
        ...this.lineYDomain,
      ]
    }

    let scheme;
    if (typeof this.scheme === 'string') {
      scheme = this.scheme;
    }else {  
      scheme = {
        ...this.scheme,
        domain: [
          ...this.scheme.domain,
          ...this.lineScheme.domain
        ]
      }
    }

    this.combinedColors = new ColorHelper(scheme, this.schemeType, domain, this.customColors);
  }

  getLegendOptions(): LegendOptions {
    const opts = {
      scaleType: this.schemeType as any,
      colors: undefined,
      domain: [],
      title: undefined,
      position: this.legendPosition
    };
    if (opts.scaleType === ScaleType.Ordinal) {
      opts.domain = this.seriesDomain;
      opts.colors = this.colors;
      opts.title = this.legendTitle;
    } else {
      opts.domain = this.yDomain;
      opts.colors = this.colors.scale;
    }
    return opts;
  }

  updateYAxisWidth({ width }: { width: number }): void {
    this.yAxisWidth = width;
    this.update();
  }

  updateXAxisHeight({ height }: { height: number }): void {
    this.xAxisHeight = height;
    this.update();
  }

  onActivate(item): void {
    const idx = this.activeEntries.findIndex(d => {
      return d.name === item.name && d.value === item.value;
    });
    if (idx > -1) {
      return;
    }

    this.activeEntries = [item, ...this.activeEntries];
    this.activate.emit({ value: item, entries: this.activeEntries });
  }

  onDeactivate(item): void {
    const idx = this.activeEntries.findIndex(d => {
      return d.name === item.name && d.value === item.value;
    });

    this.activeEntries.splice(idx, 1);
    this.activeEntries = [...this.activeEntries];

    this.deactivate.emit({ value: item, entries: this.activeEntries });
  }

  deactivateAll() {
    this.activeEntries = [...this.activeEntries];
    for (const entry of this.activeEntries) {
      this.deactivate.emit({ value: entry, entries: [] });
    }
    this.activeEntries = [];
  }
}
