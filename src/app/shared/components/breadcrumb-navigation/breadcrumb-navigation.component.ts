import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { Breadcrumb } from '../../models/breadcrumb';
import { Subject } from 'rxjs';
import { filter, first, skipWhile, takeUntil, tap } from 'rxjs/operators';
import { ActivatedRoute, NavigationStart, Router, Event } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SubdepartmentAnswerState } from '../../../apps/quap/state/subdepartment-answer.state';
import { OverviewDepartmentService } from 'src/app/apps/widget/services/overview-department.service';

@Component({
  selector: 'app-breadcrumb-navigation',
  templateUrl: './breadcrumb-navigation.component.html',
  styleUrls: ['./breadcrumb-navigation.component.scss']
})
export class BreadcrumbNavigationComponent implements OnInit, OnDestroy {

  breadcrumbs: Breadcrumb[];

  private destroyed$ = new Subject();

  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private translate: TranslateService,
    private subdepartmentAnswerState: SubdepartmentAnswerState,
    private overviewDepartmentService: OverviewDepartmentService,
  ) { }

  ngOnInit(): void {
    this.breadcrumbService.getBreadcrumbs$().pipe(
      takeUntil(this.destroyed$),
      tap(breadcrumbs => this.breadcrumbs = breadcrumbs),
    ).subscribe();

    this.translate.get('apps').pipe(first()).subscribe(next => {
      this.breadcrumbService.pushBreadcrumb({
        key: 'apps.overview.name', 
        path: '/dashboard', 
        translate: true,
      });
      this.firstLevelHandler(this.router.url.split('/').slice(1))
    })

    this.router.events
      .pipe(
        filter((event: Event): event is NavigationStart => event instanceof NavigationStart),
        takeUntil(this.destroyed$))
      .subscribe(
        (event: NavigationStart) => {
          const newLocation = event.url.split('/').slice(1);
          this.breadcrumbService.popAllToIndex(-1);
          this.breadcrumbService.pushBreadcrumb({
            key: 'apps.overview.name', 
            path: '/dashboard',
            translate: true,
          });
          this.firstLevelHandler(newLocation);
        });
  }

  firstLevelHandler(locationArr: string[]): void {
    if (locationArr[0] === 'app') {
      this.appHandler(locationArr.slice(1));
    }
    if (locationArr[0] === 'gamification') {
      this.breadcrumbService.pushBreadcrumb({
        key: 'gamification.name',
        path: '/gamification/person',
        translate: true,
      });
    }
  }

  appHandler(locationArr: string[]): void {
    if (locationArr[0] === 'health') {
      this.breadcrumbService.pushBreadcrumb({
        key: 'apps.health.name',
        path: '/app/health',
        translate: true,
      });
      return;
    }
    if (locationArr[0] === 'quap') {
      this.breadcrumbService.pushBreadcrumb({
        key: 'apps.quap.name',
        path: '/app/quap',
        translate: true,
      });
      return;
    }
    if (locationArr[0] === 'quap-departments') {
      this.breadcrumbService.pushBreadcrumb({
        key: 'apps.quap-departments.name', 
        path: '/app/quap-departments',
        translate: true,
      });
      if (locationArr[1]){
        this.handleQuapDepartments(parseInt(locationArr[1]));
      }
      return;
    }
    if (locationArr[0] === 'census') {
      this.breadcrumbService.pushBreadcrumb({
        key: 'apps.census.name',
        path: '/app/census',
        translate: true,
      });
      return;
    }
    if (locationArr[0] === 'health-departments') {
      this.breadcrumbService.pushBreadcrumb({
        key: "apps.overview-departments.name", 
        path: '/app/health-departments',
        translate: true,
      });
      if (locationArr[1]){
        this.handleOverviewDepartments(parseInt(locationArr[1]));
      }
      return;
    }
  }

  handleQuapDepartments(locationArr: number): void {
    this.subdepartmentAnswerState.getAnswersFromGroup$(locationArr).pipe(
      skipWhile(val => !val),
      first(),
    ).subscribe(data => {
      this.breadcrumbService.pushBreadcrumb({
        key: data.groupName,
        path: `app/quap-departments/${data.groupId}`,
      });
    });
  }

  handleOverviewDepartments(groupId: number): void {
    this.overviewDepartmentService.regions$.pipe(
      filter(regions => regions !== null),
      first(),
    ).subscribe(regions => {
      for (const region of regions) {
        // find the department that has the given group id
        const department = region.children.find(department => department.id === groupId);

        if (department) {
          this.breadcrumbService.pushBreadcrumb({
            key: department.name,
            path: `app/health-departments/${groupId}`,
          });
          
          return;
        }
      }
    });
  }

  navigate(index: number): void {
    this.breadcrumbService.popAllToIndex(index);
    const breadcrumb = this.breadcrumbService.getCurrentBreadcrumb();

    this.router.navigate([ breadcrumb.path ]);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }


}
