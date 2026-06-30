import { Component, inject } from '@angular/core';
import { CensusFilterService } from '../../../../store/services/census-filter.service';

import { FilterChipComponent } from '../type-filters/filter-chip/filter-chip.component';
import { TranslatePipe } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-census-filter',
    templateUrl: './census-filter.component.html',
    styleUrls: ['./census-filter.component.scss'],
    imports: [FilterChipComponent, TranslatePipe]
})
export class CensusFilterComponent {
  private censusFilter = inject(CensusFilterService);

  readonly roles = toSignal(
    this.censusFilter.getRoleFilter$(),
    {
      initialValue: [],
    }
  );

  readonly filterMale = toSignal(
    this.censusFilter.getFilterMales$(),
    {
      initialValue: true,
    }
  );

  readonly filterFemale = toSignal(
    this.censusFilter.getFilterFemales$(),
    {
      initialValue: true,
    }
  );

  readonly isLoading = toSignal(
    this.censusFilter.isLoading$(),
    {
      initialValue: true,
    }
  );

  onRoleFilterChange(element, newState) {
    const rolesCopy = this.censusFilter.getRoleFilterSnapshot();
    rolesCopy.find(el => el.value === element.value).selected = newState;
    this.censusFilter.setRoleFilter(rolesCopy);
  }
  toggleM() {
    this.censusFilter.setFilterMale(!this.filterMale);
  }

  toggleF() {
    this.censusFilter.setFilterFemales(!this.filterFemale);
  }
}
