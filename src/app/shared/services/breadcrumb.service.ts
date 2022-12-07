import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Breadcrumb} from '../models/breadcrumb';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);
  private breadcrumbHistory: Breadcrumb[] = [];
  private breadcrumbHistoryIndex = -1;

  constructor() {
  }

  getBreadcrumbs$(): Observable<Breadcrumb[]> {
    return this.breadcrumbs$.asObservable();
  }

  public pushBreadcrumb(breadcrumb: Breadcrumb): void {
    const breadcrumbs = this.breadcrumbs$.value;
    this.breadcrumbHistoryIndex++;
    if(!this.breadcrumbHistory[this.breadcrumbHistoryIndex]){
      this.breadcrumbHistory.push(breadcrumb);
    } else if(breadcrumb.name === this.breadcrumbHistory[this.breadcrumbHistoryIndex].name){
      this.breadcrumbHistory[this.breadcrumbHistoryIndex] = breadcrumb;
    }
    this.breadcrumbs$.next([...breadcrumbs, breadcrumb]);
  }

  public findBreadcrumbInHistory(location: string) {
    location = location === '/dashboard' ? '/' : location;
    let index = this.breadcrumbHistory.findIndex(breadcrumb => breadcrumb?.path.split('/' ).join('') === location.split('/').join(''));
    return Math.max(index, 0);
  }

  public popBreadcrumb(): Breadcrumb {
    const breadcrumbs = this.breadcrumbs$.value;
    const breadcrumb = breadcrumbs.pop();
    this.breadcrumbHistoryIndex--;
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
