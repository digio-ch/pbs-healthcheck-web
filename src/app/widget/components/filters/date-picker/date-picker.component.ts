import {Component, Input, OnInit} from '@angular/core';
import {FilterFacade} from '../../../../store/facade/filter.facade';
import {FilterDate} from '../../../../shared/models/date-selection/filter-date';
import {DateSelection} from '../../../../shared/models/date-selection/date-selection';
import {DateQuickSelectionOptions} from '../../../../shared/models/date-selection/date-quick-selection-options';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {

  @Input() supportsDateRange = true;
  @Input() availableDates: FilterDate[];
  @Input() dateSelection: DateSelection;
  selection: DateSelection;
  options: DateQuickSelectionOptions;

  constructor(private filterFacade: FilterFacade) { }

  ngOnInit(): void {
    this.options = this.filterFacade.getAvailableDateQuickSelectionOptionsSnapshot();
    this.selection = new DateSelection(
      this.dateSelection.startDate,
      this.dateSelection.endDate,
      this.dateSelection.isRange
    );
    this.clearSelection();
    this.initSelection();
  }

  initSelection() {
    const startIndex = this.availableDates.findIndex((d: FilterDate) => {
      return d.getISODate() === this.selection.getISOStartDate();
    });
    if (!this.selection.isRange) {
      this.availableDates[startIndex].selected = true;
      this.selection.endDate = null;
      return;
    }
    const endIndex = this.availableDates.findIndex((d: FilterDate) => {
      return d.getISODate() === this.selection.getISOEndDate();
    });
    const from = startIndex > endIndex ? endIndex : startIndex;
    const to = startIndex < endIndex ? endIndex : startIndex;
    for (let i = from; i <= to; i++) {
      this.availableDates[i].selected = true;
    }
  }

  clearSelection() {
    this.availableDates.forEach(item => item.selected = false);
  }

  selectDatesBetweenStartAndEnd() {
    const startIndex = this.availableDates.findIndex((d: FilterDate) => {
      return d.selected;
    });
    let endIndex = null;
    for (let i = this.availableDates.length - 1; i >= startIndex; i--) {
      if (this.availableDates[i].selected) {
        endIndex = i;
        break;
      }
    }
    const from = startIndex > endIndex ? endIndex : startIndex;
    const to = startIndex < endIndex ? endIndex : startIndex;
    for (let i = from; i < to; i++) {
      this.availableDates[i].selected = true;
    }
  }

  selectItem(item: FilterDate) {
    this.selection = this.selection.clone();
    if (this.supportsDateRange) {
      if (this.selection.startDate === null) {
        item.selected = true;
        this.selection.startDate = item.date;
        this.selection.endDate = null;
        return;
      }
      if (this.selection.endDate === null && !this.selection.startDate.isSame(item.date)) {
        item.selected = true;
        if (this.selection.startDate.isAfter(item.date)) {
          this.selection.endDate = this.selection.startDate;
          this.selection.startDate = item.date;
        } else {
          this.selection.endDate = item.date;
        }
        this.selectDatesBetweenStartAndEnd();
        return;
      }
    }
    this.clearSelection();
    item.selected = true;
    this.selection.startDate = item.date;
    this.selection.endDate = null;
  }

  onQuickSelect(option: DateSelection, event) {
    this.selection = option.clone();
    this.clearSelection();
    this.initSelection();
    event.stopPropagation();
  }

  onConfirm() {
    this.selection.isRange = this.selection.endDate !== null;
    this.filterFacade.setDateSelection(this.selection);
  }
}
