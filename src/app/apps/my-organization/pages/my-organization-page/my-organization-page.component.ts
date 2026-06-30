import { Component, inject } from '@angular/core';
import { WidgetModule } from "src/app/apps/widget/widget.module";
import { DefaultFilterFacade } from 'src/app/store/facade/default-filter.facade';
import { DepartmentFilterComponent } from "src/app/shared/components/filters/department-filter/department-filter.component";
import { GroupFacade } from 'src/app/store/facade/group.facade';
import { combineLatest, filter, map, merge, of, startWith, switchMap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { WidgetFacade } from 'src/app/store/facade/widget.facade';
import { MyOrganizationService } from '../../services/my-organization.service';
@Component({
  standalone: true,
  selector: 'app-my-organization-page',
  templateUrl: './my-organization-page.component.html',
  styleUrl: './my-organization-page.component.scss',
  imports: [WidgetModule, DepartmentFilterComponent],
})
export class MyOrganizationPageComponent {
  private myOrganizationService = inject(MyOrganizationService);
  private groupFacade = inject(GroupFacade);
  private translateService = inject(TranslateService);
  private widgetFacade = inject(WidgetFacade);
  readonly filterFacade = inject(DefaultFilterFacade);

  readonly departments = toSignal(
    combineLatest([
      this.groupFacade.getCurrentGroup$(),
      this.filterFacade.getDateSelection$(),
    ]).pipe(
      switchMap(([group, selection]) => {
        if (selection.isRange) {
          return of(undefined);
        }

        return this.myOrganizationService.getDepartmentNames(group.id, selection.startDate).pipe(
          startWith(undefined),
        );
      })
    )
  );

  constructor() {
    const langSwitch$ = merge(
      of(null), // trigger if the page is loaded after the initial onLangChange
      this.translateService.onLangChange
    );

    // load filter data
    combineLatest([
      this.groupFacade.getCurrentGroup$(),
      langSwitch$,
    ]).pipe(
      takeUntilDestroyed(),
      map(([group, _]) => group),
      filter(group => !!group),

      switchMap(group => this.filterFacade.loadMyOrganizationFilter(group))
    ).subscribe();

    combineLatest([
      this.groupFacade.getCurrentGroup$(),
      this.filterFacade.getFilterState$()
    ]).pipe(
      takeUntilDestroyed(),
      switchMap(([group, filterState]) => this.widgetFacade.refreshMyOrganizationData(
        filterState.dateSelection,
        group,
        filterState.peopleTypes,
        filterState.groupTypes,
      )),
    ).subscribe();
  }
}
