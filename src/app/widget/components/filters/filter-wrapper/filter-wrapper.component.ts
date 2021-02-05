import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FilterFacade} from '../../../../store/facade/filter.facade';
import {Observable} from 'rxjs';
import {FilterDate} from '../../../../shared/models/date-selection/filter-date';
import {DateSelection} from '../../../../shared/models/date-selection/date-selection';

@Component({
  selector: 'app-filter-wrapper',
  templateUrl: './filter-wrapper.component.html',
  styleUrls: ['./filter-wrapper.component.scss']
})
export class FilterWrapperComponent implements OnInit {
  @ViewChild('dateInput', { static: false }) dateInput: ElementRef;
  isLoading$: Observable<boolean>;
  dateSelection: DateSelection;
  availableDates: FilterDate[];
  menuOpen = false;

  constructor(private filterFacade: FilterFacade) { }

  ngOnInit(): void {
    this.isLoading$ = this.filterFacade.isLoading$();
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
    if (this.dateInput) {
      this.dateInput.nativeElement.style.width = this.dateSelection.isRange ? '130px' : '60px';
    }
    return this.dateSelection.getDisplayValue();
  }
}
