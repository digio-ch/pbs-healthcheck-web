import { Component, ElementRef, computed, effect, inject, input, signal, viewChild } from '@angular/core';
import { DefaultFilterFacade } from '../../../../store/facade/default-filter.facade';
import { MatMenuTrigger, MatMenu } from '@angular/material/menu';

import { DatePickerComponent } from '../date-picker/date-picker.component';
import { TranslatePipe } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
@Component({
    selector: 'app-date-picker-input',
    templateUrl: './date-picker-input.component.html',
    styleUrls: ['./date-picker-input.component.scss'],
    imports: [MatMenuTrigger, MatMenu, DatePickerComponent, TranslatePipe]
})
export class DatePickerInputComponent {
  private filterFacade = inject(DefaultFilterFacade);
  
  readonly supportsDateRange = input(true);

  readonly dateInput = viewChild.required<ElementRef>('dateInput');

  readonly menuOpen = signal(false);

  readonly dateSelection = toSignal(
    this.filterFacade.getDateSelection$(),
    {
      initialValue: null,
    }
  );
  readonly availableDates = toSignal(
    this.filterFacade.getAvailableDates$(),
    {
      initialValue: null,
    }
  );

  readonly displayValue = computed(() => {
    return this.dateSelection()?.getDisplayValue() ?? '';
  });

  constructor() {
    effect(() => {
      const selection = this.dateSelection();

      if (!this.dateSelection()) {
        return;
      }

      this.dateInput().nativeElement.style.width = selection.isRange ? '130px' : '60px';
    });
  }

  onOpen() {
    this.menuOpen.set(true);
  }

  onClose() {
    this.menuOpen.set(false);
  }

  quickSelect() {
    const quickSelectOption = this.filterFacade.getAvailableDateQuickSelectionOptionsSnapshot()
      .rangeOptions
      .find(el => el.label === 'datePicker.range.beggingOfLastYear');

    this.filterFacade.setDateSelection(quickSelectOption.dateSelection);
  }
}
