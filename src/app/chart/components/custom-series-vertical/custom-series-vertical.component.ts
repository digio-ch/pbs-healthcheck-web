import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SeriesVerticalComponent, BarChartModule, TooltipModule } from '@swimlane/ngx-charts';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'g[app-custom-series-vertical]',
    templateUrl: './custom-series-vertical.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('animationState', [
            transition(':leave', [
                style({
                    opacity: 1
                }),
                animate(500, style({ opacity: 0 }))
            ])
        ])
    ],
    imports: [NgFor, BarChartModule, TooltipModule, NgIf]
})
export class CustomSeriesVerticalComponent extends SeriesVerticalComponent {
  isActive(entry): boolean {
    if (!this.activeEntries) { return false; }
    const item = this.activeEntries.find((d: any) => {
      return entry.name === d.name && entry.series === d.series && entry.value === d.value;
    });
    return item !== undefined;
  }
}
