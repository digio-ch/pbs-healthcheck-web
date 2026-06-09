import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, merge, of, Subject } from 'rxjs';
import { GroupFacade } from 'src/app/store/facade/group.facade';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { OverviewDepartment, OverviewDepartmentsRegion } from '../../models/overview-department';
import { OverviewDepartmentService } from '../../services/overview-department.service';
import { TranslateService } from '@ngx-translate/core';
import { LegendPosition } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-overview-departments-app',
  templateUrl: './overview-departments-app.component.html',
  styleUrls: ['./overview-departments-app.component.scss']
})
export class OverviewDepartmentsAppComponent implements OnInit, OnDestroy {

  loading = true;
  regions: OverviewDepartmentsRegion[] = [];
  
  private destroyed$ = new Subject();
  legendPosition = LegendPosition.Below;

  constructor(
    private groupFacade: GroupFacade,
    private overviewDepartmentService: OverviewDepartmentService,
    private translateService: TranslateService,
    ) { }

  ngOnInit(): void {
    this.overviewDepartmentService.regions$.pipe(
      filter(r => r !== null),
    ).subscribe((regions) => {
      this.regions = regions;
      this.loading = false;
    })

    const langSwitch$ = merge(
      of(null), // trigger if the page is loaded after the initial onLangChange
      this.translateService.onLangChange
    );

    // laod overview departments
    combineLatest([
      this.groupFacade.getCurrentGroup$(),
      langSwitch$,
    ]).pipe(
      takeUntil(this.destroyed$),
      switchMap(([group]) => {
        this.loading = true; 
        return this.overviewDepartmentService.load(group.id);
      })
    ).subscribe();
  }

  getColorSchema(department: OverviewDepartment): any {
    return {
      domain: department.groupTypes.map(g => g.color),
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
