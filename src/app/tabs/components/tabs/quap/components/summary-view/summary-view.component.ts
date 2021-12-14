import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Summary} from '../../services/calculation.helper';
import {Observable, Subscription} from 'rxjs';
import {QuapSettings, QuapSettingsService} from '../../services/quap-settings.service';
import {timeout} from 'rxjs/operators';

@Component({
  selector: 'app-summary-view',
  templateUrl: './summary-view.component.html',
  styleUrls: ['summary-view.component.scss']
})
export class SummaryViewComponent implements OnInit, OnDestroy {

  readonly summaryValueMapping: { [index: number]: number } = {
    // not answered
    0: 1, // index of the previous value (element displayed on the left)
    // not relevant
    1: 2,
    // doesn't apply
    2: 3,
    // somewhat applies
    3: 4,
    // partially applies
    4: 5,
    // fully applies
    5: null,
  };

  @Input() values$: Observable<Summary>;
  @Input() values: Summary = [0, 100, 0, 0, 0, 0];
  @Input() text: string;
  @Input() thin = false;
  @Input() clickable = false;

  private width = 318;
  private total: number;

  settings: QuapSettings;

  empty = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private quapSettingsService: QuapSettingsService,
  ) { }

  ngOnInit(): void {
    if (this.values$) {
      this.subscriptions.push(this.values$.subscribe(values => {
        this.values = values;

        this.calculateTotal();

        if (this.total === this.values[1]) {
          this.empty = true;
        }
      }));
    } else {
      this.calculateTotal();

      if (this.total === this.values[1]) {
        this.empty = true;
      }
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
    let positionOffset = 0;
    let previousIndex = this.summaryValueMapping[index];
    while (previousIndex) {
      positionOffset += this.calculateElementWidth(previousIndex);

      previousIndex = this.summaryValueMapping[previousIndex];
    }
    return positionOffset + 1;
  }

}
