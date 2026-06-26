import { Component, inject, Signal } from '@angular/core';
import { DefaultFilterFacade } from '../../../../store/facade/default-filter.facade';
import { GroupType } from '../../../models/group-type';
import { PeopleType } from '../../../models/people-type';
import { TypeFilter } from '../../../models/type-filter';
import { FilterChipComponent } from './filter-chip/filter-chip.component';
import { TranslatePipe } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-type-filters',
    templateUrl: './type-filters.component.html',
    styleUrls: ['./type-filters.component.scss'],
    imports: [FilterChipComponent, TranslatePipe]
})
export class TypeFiltersComponent {
  private filterFacade = inject(DefaultFilterFacade);

  readonly groupTypes: Signal<GroupType[]> = toSignal(
    this.filterFacade.getGroupTypes$(),
    {
      initialValue: []
    }
  );
  readonly peopleTypes: Signal<PeopleType[]> = toSignal(
    this.filterFacade.getPeopleTypes$(),
    {
      initialValue: []
    }
  );

  readonly isLoading = toSignal(
    this.filterFacade.isLoading$(),
    {
      initialValue: true,
    }
  )

  onPeopleTypeToggle(peopleType: PeopleType, selected: boolean) {
    this.filterFacade.setPeopleTypeSelected(peopleType, selected);
  }

  onGroupTypeToggle(groupType: GroupType, selected: boolean) {
    this.filterFacade.setGroupTypeSelected(groupType, selected);
  }

  /**
   * Returns true when there is only one remaining selected filter. \
   * This prevents the user from deselecting all.
   */
  shouldBeDisabled(items: TypeFilter[], item: TypeFilter): boolean {
    return items.filter(itm => itm.selected).length === 1 && item.selected;
  }
}
