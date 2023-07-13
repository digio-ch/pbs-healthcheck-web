import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {DateSelection} from '../../../models/date-selection/date-selection';
import {DateModel} from '../../../models/date-selection/date.model';
import {DefaultFilterFacade} from '../../../../store/facade/default-filter.facade';

@Component({
  selector: 'app-date-picker-input',
  templateUrl: './date-picker-input.component.html',
  styleUrls: ['./date-picker-input.component.scss']
})
export class DatePickerInputComponent implements OnInit {
  @ViewChild('dateInput', { static: false }) dateInput: ElementRef;

  @Input() supportsDateRange = true;

  dateSelection: DateSelection;
  availableDates: DateModel[];
  menuOpen = false;

  constructor(
    private filterFacade: DefaultFilterFacade,
  ) { }

  ngOnInit(): void {
    this.filterFacade.getDateSelection$().subscribe(dateSelection => {
      if (!dateSelection) {
        return;
      }
      this.dateSelection = dateSelection;
    });
    this.filterFacade.getAvailableDates$().subscribe(dates => {
      if (!dates) {
        return;
      }
      this.availableDates = dates;
    });
  }

  onOpen() {
    this.menuOpen = true;
  }

  onClose() {
    this.menuOpen = false;
  }

  getDisplayValue(): string {
    if (!this.dateSelection) {
      return '';
    }

    if (this.dateInput) {
      this.dateInput.nativeElement.style.width = this.dateSelection.isRange ? '130px' : '60px';
    }
    return this.dateSelection.getDisplayValue();
  }

}
