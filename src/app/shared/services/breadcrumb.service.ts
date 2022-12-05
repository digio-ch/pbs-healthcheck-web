import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Breadcrumb} from '../models/breadcrumb';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

  constructor() {
  }

  getBreadcrumbs$(): Observable<Breadcrumb[]> {
    return this.breadcrumbs$.asObservable();
  }

  public pushBreadcrumb(breadcrumb: Breadcrumb): void {
    const breadcrumbs = this.breadcrumbs$.value;
    this.breadcrumbs$.next([...breadcrumbs, breadcrumb]);
  }

  public setBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
    this.breadcrumbs$.next(breadcrumbs);
  }

  public popBreadcrumb(): Breadcrumb {
    const breadcrumbs = this.breadcrumbs$.value;
    const breadcrumb = breadcrumbs.pop();
    this.breadcrumbs$.next(breadcrumbs);
    return breadcrumb;
  }

  public popAllToIndex(index: number): number {
    const breadcrumbs = this.breadcrumbs$.value;

    let deleted = 0;
    for (let i = breadcrumbs.length - 1; i > index; i--) {
      this.popBreadcrumb();
      deleted++;
    }

    return deleted;
  }

  public getCurrentBreadcrumb(): Breadcrumb {
    const breadcrumbs = this.breadcrumbs$.value;
    return breadcrumbs[breadcrumbs.length - 1];
  }
}
