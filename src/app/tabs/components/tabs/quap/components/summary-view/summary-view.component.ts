import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-summary-view',
  templateUrl: './summary-view.component.html',
  styleUrls: ['summary-view.component.scss']
})
export class SummaryViewComponent implements OnInit {

  private width = 318;
  private total: number;

  @Input() values: number[];
  @Input() text: string;

  constructor() { }

  ngOnInit(): void {
    if (this.values === undefined || this.values.length === 0) {
      this.values = [100, 0, 0, 0, 0];
    }

    this.total = this.values.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }

  calculateElementWidth(index: number): number {
    return (this.width / 100 * this.values[index]);
  }

  calculateElementX(index: number): number {
    let prev = 0;
    for (let i = 0; i < index; i++) {
      prev += this.calculateElementWidth(i);
    }
    return prev + 1;
  }

}
