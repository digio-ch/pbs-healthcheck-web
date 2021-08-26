import {Component, Input, OnInit} from '@angular/core';
import {Summary} from '../../services/calculation.helper';

@Component({
  selector: 'app-summary-view',
  templateUrl: './summary-view.component.html',
  styleUrls: ['summary-view.component.scss']
})
export class SummaryViewComponent implements OnInit {

  private width = 318;
  private total: number;

  @Input() values: Summary;
  @Input() text: string;

  constructor() { }

  ngOnInit(): void {
    if (this.values === undefined) {
      this.values = [0, 100, 0, 0, 0, 0];
    }

    this.total = this.values.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }

  calculateElementWidth(index: number): number {
    return (this.width / this.total * this.values[index]);
  }

  calculateElementX(index: number): number {
    let prev = 0;
    for (let i = 0; i < index; i++) {
      prev += this.calculateElementWidth(i);
    }
    return prev + 1;
  }

}
