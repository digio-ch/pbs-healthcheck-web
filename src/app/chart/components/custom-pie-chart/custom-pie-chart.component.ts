import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {PieChartComponent} from '@swimlane/ngx-charts';

@Component({
  selector: 'app-custom-pie-chart',
  templateUrl: './custom-pie-chart.component.html',
  styleUrls: ['./custom-pie-chart.component.scss']
})
export class CustomPieChartComponent extends PieChartComponent implements OnInit, AfterViewInit {
  customPieChartLabels: any[] = [];

  ngOnInit(): void {
    if (window.innerWidth < 1000) {
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
      total += parseFloat(item.value);
    }

    let chartRadius = 0;
    for (let i = 0; i <  arcs.length; i++) {
      const arcBox = (arcs.item(i) as any).getBBox();
      if (arcBox.x + arcBox.width > chartRadius) {
        chartRadius = arcBox.x + arcBox.width;
      }
    }
    let pastPercentage = 0;
    for (let i = 0; i <  arcs.length; i++) {
      const percent = (100 / total) * parseFloat(this.data[i].value);
      if (percent > 10) {
        const textPosition = this.calculateLabelPosition(chartRadius, pastPercentage, percent);
        const text = this.createText(this.data[i].value, textPosition.x, textPosition.y);
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
    this.labels = event.target.innerWidth >= 1000;
  }

}

interface Position {
  x: number;
  y: number;
}
