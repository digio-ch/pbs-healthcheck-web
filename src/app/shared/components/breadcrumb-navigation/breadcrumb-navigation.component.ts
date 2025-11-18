import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {BreadcrumbService} from '../../services/breadcrumb.service';
import {Breadcrumb} from '../../models/breadcrumb';
import {Subject} from 'rxjs';
import {filter, first, takeUntil, tap} from 'rxjs/operators';
import {ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterEvent} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {SubdepartmentAnswerState} from '../../../apps/quap/state/subdepartment-answer.state';
import { OverviewDepartmentService } from 'src/app/apps/widget/services/overview-department.service';

@Component({
  selector: 'app-breadcrumb-navigation',
  templateUrl: './breadcrumb-navigation.component.html',
  styleUrls: ['./breadcrumb-navigation.component.scss']
})
export class BreadcrumbNavigationComponent implements OnInit, OnDestroy {

  breadcrumbs: Breadcrumb[];

  private appTranslations = null;
  private destroyed$ = new Subject();

  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
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
      this.appTranslations = next;
      this.breadcrumbService.pushBreadcrumb({name: this.appTranslations.overview.name , path: '/dashboard'});
      this.firstLevelHandler(this.router.url.split('/').slice(1))
    })

    this.router.events
      .pipe(
        filter((event: RouterEvent) => event instanceof NavigationStart),
        takeUntil(this.destroyed$))
      .subscribe(
        (event: NavigationStart) => {
          const newLocation = event.url.split('/').slice(1);
          this.breadcrumbService.popAllToIndex(-1);
          this.breadcrumbService.pushBreadcrumb({name: this.appTranslations.overview.name , path: '/dashboard'});
          this.firstLevelHandler(newLocation);
        });
  }

  firstLevelHandler(locationArr: string[]): void {
    if (locationArr[0] === 'app') {
      this.appHandler(locationArr.slice(1));
    }
    if (locationArr[0] === 'gamification') {
      this.breadcrumbService.pushBreadcrumb({name: this.appTranslations.gamification.name, path: '/gamification/person'});
    }
  }

  appHandler(locationArr: string[]): void {
    if (locationArr[0] === 'health') {
      this.breadcrumbService.pushBreadcrumb({name: this.appTranslations.health.name, path: '/app/health'});
      return;
    }
    if (locationArr[0] === 'quap') {
      this.breadcrumbService.pushBreadcrumb({name: this.appTranslations.quap.name, path: '/app/quap'});
      return;
    }
    if (locationArr[0] === 'quap-departments') {
      this.breadcrumbService.pushBreadcrumb({name: this.appTranslations['quap-departments'].name, path: '/app/quap-departments'});
      if (locationArr[1]){
        this.handleQuapDepartments(parseInt(locationArr[1]));
      }
      return;
    }
    if (locationArr[0] === 'census') {
      this.breadcrumbService.pushBreadcrumb({name: this.appTranslations.census.name, path: '/app/census'});
      return;
    }
    if (locationArr[0] === 'health-departments') {
      this.breadcrumbService.pushBreadcrumb({name: this.appTranslations['overview-departments'].name, path: '/app/health-departments'});
      if (locationArr[1]){
        this.handleOverviewDepartments(parseInt(locationArr[1]));
      }
      return;
    }
  }

  handleQuapDepartments(locationArr: number): void {
    this.subdepartmentAnswerState.getAnswersFromGroup$(locationArr).pipe(
      first(),
    ).subscribe(data => {
      this.breadcrumbService.pushBreadcrumb({
        name: data.groupName,
        path: `app/quap-departments/${data.groupId}`,
      });
    });
  }

  handleOverviewDepartments(groupId: number): void {
    this.overviewDepartmentService.regions$.pipe(
      filter(regions => regions.length > 0),
      first(),
    ).subscribe(regions => {
      for (const region of regions) {
        // find the department that has the given group id
        const department = region.children.find(department => department.id === groupId);

        if (department) {
          this.breadcrumbService.pushBreadcrumb({
            name: department.name,
            path: `app/health-departments/${groupId}`,
          });
          
          return;
        }
      }

      // navigate back to the overview-departments page because the given group is not found
      this.router.navigate(["app/health-departments"]);
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
