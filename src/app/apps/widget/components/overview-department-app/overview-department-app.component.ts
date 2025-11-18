import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, first, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { GroupFacade } from 'src/app/store/facade/group.facade';
import { OverviewDepartmentService } from '../../services/overview-department.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DefaultFilterFacade } from 'src/app/store/facade/default-filter.facade';
import { WidgetFacade } from 'src/app/store/facade/widget.facade';

@Component({
  selector: 'app-overview-department-app',
  templateUrl: './overview-department-app.component.html',
  styleUrls: ['./overview-department-app.component.scss']
})
export class OverviewDepartmentAppComponent implements OnInit,OnDestroy {

  private destroyed$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupFacade: GroupFacade,
    private overviewDepartmentService: OverviewDepartmentService,
    private filterFacade: DefaultFilterFacade,
    private widgetFacade: WidgetFacade,
  ) { }

  ngOnInit(): void {
    // load the overview departments to get the department name for the breadcrumb
    if (!this.overviewDepartmentService.hasRegions()) {
      this.groupFacade.getCurrentGroup$().pipe(
        takeUntil(this.destroyed$),
        switchMap(group => 
          this.overviewDepartmentService.load(group.id),
        )
      ).subscribe();
    }

    // load department filter
    combineLatest([
      this.groupFacade.getCurrentGroup$(),
      this.getDepartmentId$(),
    ]).pipe(
      takeUntil(this.destroyed$),
      switchMap(([group, departmentId]) =>
        this.filterFacade.loadFilterDataForDepartment(group, departmentId)
      )
    ).subscribe();

    // fetch widget data of department
    combineLatest([
      this.groupFacade.getCurrentGroup$(),
      this.getDepartmentId$(),
      this.filterFacade.getUpdates$(),
    ]).pipe(
      takeUntil(this.destroyed$),
      filter(() => this.filterFacade.isInitialized()),

      switchMap(([group, departmentId, filterState]) => 
        this.widgetFacade.refreshOverviewDataOfDepartment(
          filterState.dateSelection, 
          group, 
          departmentId,
          filterState.peopleTypes, 
          filterState.groupTypes,
        ),
      )
    ).subscribe();
  }

  // TODO: add check whether the department id is contained in the regions
  private getDepartmentId$(): Observable<number> {
    return this.route.params.pipe(
      // extract department id and navigate back if the id is not a valid number
      map((params: { id: any }) => params.id),
      tap(departmentId => {
        if(isNaN(departmentId)) {
          this.router.navigate(['/app/health-departments']);  
        }
      }),
      filter(departmentId => !isNaN(departmentId)),
      map(departmentId => +departmentId), // map to number
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
