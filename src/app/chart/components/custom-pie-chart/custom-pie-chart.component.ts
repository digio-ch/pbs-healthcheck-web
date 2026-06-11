import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, NgZone, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { PieChartComponent, ChartCommonModule, PieChartModule } from '@swimlane/ngx-charts';

@Component({
    selector: 'app-custom-pie-chart',
    templateUrl: './custom-pie-chart.component.html',
    styleUrls: ['./custom-pie-chart.component.scss'],
    imports: [ChartCommonModule, PieChartModule]
})
export class CustomPieChartComponent extends PieChartComponent implements OnInit, AfterViewInit {
  protected override chartElement: ElementRef;
  protected override zone: NgZone;
  protected override cd: ChangeDetectorRef;

  customPieChartLabels: any[] = [];
  
  constructor() {
    const chartElement = inject(ElementRef);
    const zone = inject(NgZone);
    const cd = inject(ChangeDetectorRef);
    const platformId = inject(PLATFORM_ID);

    super(chartElement, zone, cd, platformId);
  
    this.chartElement = chartElement;
    this.zone = zone;
    this.cd = cd;
  }

  @Input()
  showLabels = true;

  @Input()
  showPercentages = true;

  labels = true;

  ngOnInit(): void {
    if (window.innerWidth < 1000 || !this.showLabels) {
      this.labels = false;
    }
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.drawOnPieChart();
  }

  update() {
    super.update();
    this.drawOnPieChart();
  }

  /**
   * ngx-charts doesn't offer chart labels on the pie slices out-of-the-box, so
   * they have to be drawn manually
   */
  drawOnPieChart() {
    let node = this.chartElement.nativeElement;
    let svg: any;
    for (let i = 0; i < 5; i++) {
      if (i === 3) {
        svg = node.childNodes[0]; // pie chart svg
      }
      // at the end of this loop, the node should contain all slices in its children node
      node = node.childNodes[0];
    }
    // clear the previous text if any
    this.customPieChartLabels.forEach(i => {
      if (svg.childNodes[1]) {
        svg.removeChild(svg.childNodes[1]);
      }
    });
    const arcs: HTMLCollection = node.getElementsByClassName('arc-group');
    let total = 0;
    for (const item of this.data) {
      // value is a string for some reason
      total += parseInt(item.value as unknown as string);
    }

    let chartRadius = 0;
    for (let i = 0; i <  arcs.length; i++) {
      const arcBox = (arcs.item(i) as any).getBBox();
      if (arcBox.x + arcBox.width > chartRadius) {
        chartRadius = arcBox.x + arcBox.width;
      }
    }

    // skip the creation of the percentage texts
    if (!this.showPercentages) {
      return;
    }

    let pastPercentage = 0;
    for (let i = 0; i <  arcs.length; i++) {
      // value is a string for some reason
      let value = parseInt(this.data[i].value as unknown as string);
      const percent = (100 / total) * value;
      if (percent > 10) {
        const textPosition = this.calculateLabelPosition(chartRadius, pastPercentage, percent);
        const text = this.createText(this.data[i].value.toString(), textPosition.x, textPosition.y);
        this.customPieChartLabels.push(text);
        svg.append(text);
      }
      pastPercentage += percent;
    }
  }

  createText(content: string, x: number, y: number): SVGTextElement {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '' + x);
    text.setAttribute('y', '' + y);
    text.textContent = content;
    text.setAttribute('text-anchor', 'middle');
    return text;
  }

  calculateLabelPosition(chartRadius: number, pastPercentage: number, arcPercentage: number): Position {
    let percentage = pastPercentage + (arcPercentage / 2);
    let percentageOffset = 0;
    while (percentage > 25) {
      percentage -= 25;
      percentageOffset += 1;
    }
    const angle = 360 / 100 * percentage;
    const adjacentCathetus = chartRadius * Math.cos(this.degreesToRadiant(angle));
    const oppositeCathetus = chartRadius * Math.sin(this.degreesToRadiant(angle));

    const position = {x: 0, y: 0};
    switch (percentageOffset) {
      case 0:
        position.x = oppositeCathetus;
        position.y = -adjacentCathetus;
        break;
      case 1:
        position.x = adjacentCathetus;
        position.y = oppositeCathetus;
        break;
      case 2:
        position.x = -oppositeCathetus;
        position.y = adjacentCathetus;
        break;
      case 3:
        position.x = -adjacentCathetus;
        position.y = -oppositeCathetus;
        break;
    }

    return this.getCenterOfPositions({x: 0, y: 0}, position);
  }

  degreesToRadiant(degrees: number): number {
    return degrees * Math.PI / 180;
  }

  getCenterOfPositions(positionOne: Position, positionTwo: Position): Position {
    return {x: (positionOne.x + positionTwo.x) / 2, y: (positionOne.y + positionTwo.y) / 2};
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // skip if labels are disabled
    if (!this.showLabels) {
      return;
    }

    this.labels = event.target.innerWidth >= 1000;
  }

}

interface Position {
  x: number;
  y: number;
}
