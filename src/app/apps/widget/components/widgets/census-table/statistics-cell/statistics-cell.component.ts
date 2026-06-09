import { Component, Input, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
    selector: 'app-statistics-cell',
    templateUrl: './statistics-cell.component.html',
    styleUrls: ['./statistics-cell.component.scss'],
    imports: [NgStyle]
})
export class StatisticsCellComponent implements OnInit {
  @Input() value = 0;
  @Input() threshHold = 20;
  constructor() { }

  ngOnInit(): void {
  }

  get isNumeric() {
    return !isNaN(this.value);
  }
  // Highlight positive values
  get isPositive() {
    return this.value >= this.threshHold;
  }

  // Highlight negative values
  get isNegative() {
    return this.value <= -this.threshHold;
  }
}
