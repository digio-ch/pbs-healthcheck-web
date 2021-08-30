import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Summary} from '../../services/calculation.helper';
import {Subscription} from 'rxjs';
import {QuapSettings, QuapSettingsService} from '../../services/quap-settings.service';
import {timeout} from 'rxjs/operators';

@Component({
  selector: 'app-summary-view',
  templateUrl: './summary-view.component.html',
  styleUrls: ['summary-view.component.scss']
})
export class SummaryViewComponent implements OnInit, OnDestroy {

  private width = 318;
  private total: number;

  @Input() values: Summary;
  @Input() text: string;

  settings: QuapSettings;

  private empty = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private quapSettingsService: QuapSettingsService,
  ) { }

  ngOnInit(): void {
    if (this.values === undefined) {
      this.values = [0, 100, 0, 0, 0, 0];
    }

    this.calculateTotal();

    if (this.total === this.values[1]) {
      this.empty = true;
    }

    this.subscriptions.push(this.quapSettingsService.getSettings$().subscribe(settings => {
      this.settings = settings;

      this.calculateTotal();
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  calculateTotal(): void {
    let total = this.values.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    if (this.settings && !this.settings.showNotRelevant && !this.empty) {
      total = total - this.values[1];
    }

    this.total = total;
  }

  calculateElementWidth(index: number): number {
    if (this.settings && !this.settings.showNotRelevant && index === 1 && !this.empty) {
      return 0;
    }

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
