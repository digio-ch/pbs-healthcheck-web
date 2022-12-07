import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {BreadcrumbService} from '../../services/breadcrumb.service';
import {Breadcrumb} from '../../models/breadcrumb';
import {Subject} from 'rxjs';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {ActivatedRoute, NavigationStart, Router, RouterEvent} from '@angular/router';

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
  ) { }

  ngOnInit(): void {
    this.breadcrumbService.getBreadcrumbs$().pipe(
      takeUntil(this.destroyed$),
      tap(breadcrumbs => this.breadcrumbs = breadcrumbs),
    ).subscribe();
    this.router.events
      .pipe(
        filter((event: RouterEvent) => event instanceof NavigationStart),
        takeUntil(this.destroyed$))
      .subscribe(
        (event: NavigationStart) =>
        {
          if (event.navigationTrigger === 'popstate') {
            const newLocation = event.url;
            const index = this.breadcrumbService.findBreadcrumbInHistory(newLocation)
            this.breadcrumbService.popAllToIndex(index);
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
