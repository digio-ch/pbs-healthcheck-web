import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { GroupFacade } from 'src/app/store/facade/group.facade';
import { OverviewDepartmentService } from '../../services/overview-department.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DefaultFilterFacade } from 'src/app/store/facade/default-filter.facade';
import { WidgetFacade } from 'src/app/store/facade/widget.facade';
import { OverviewDepartmentsRegion } from '../../models/overview-department';

@Component({
  selector: 'app-overview-department-app',
  templateUrl: './overview-department-app.component.html',
  styleUrls: ['./overview-department-app.component.scss']
})
export class OverviewDepartmentAppComponent implements OnInit,OnDestroy {
  @ViewChild('settingsView', { static: true }) settingsView: TemplateRef<any>;

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

  private getDepartmentId$(): Observable<number> {
    const id$ = this.route.params.pipe(
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

    // get regions as soon as they are loaded
    const regions$ = this.overviewDepartmentService.regions$.pipe(
      filter(regions => regions !== null),
    );

    // check if the region / canton is allowed to access the department
    return combineLatest([
      regions$,
      id$,
    ]).pipe(
      tap(([regions, departmentId]) => {
        if (this.regionsContainDepartmentId(regions, departmentId)) {
          return;
        }
        
        this.router.navigate(['/app/health-departments']);  
      }),
      filter(([regions, departmentId]) =>
        this.regionsContainDepartmentId(regions, departmentId)
      ),
      map(([_, departmentId]) => departmentId)
    )
  }

  private regionsContainDepartmentId(regions: OverviewDepartmentsRegion[], departmentId): boolean {
    return regions.some(region => region.children.some(dep => dep.id === departmentId))
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
