import {Injectable} from "@angular/core";
import {DateSelection} from "../../shared/models/date-selection/date-selection";
import {Group} from "../../shared/models/group";
import {FilterFacade} from "./filter.facade";
import {GroupFacade} from "./group.facade";
import {BehaviorSubject, Observable} from "rxjs";
import {DataProviderService} from '../../shared/services/data-provider.service';

@Injectable({
  providedIn: 'root'
})
export class DataFacade {
  handler: BehaviorSubject<DataProviderService> = new BehaviorSubject<DataProviderService>(null);
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  error: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private filterFacade: FilterFacade,
    private groupFacade: GroupFacade,
  ) {
    this.filterFacade.getUpdates$().subscribe(data => {
      if (!this.handler.value) {
        return;
      }

      const group = this.groupFacade.getCurrentGroupSnapshot();
      setTimeout(() => {
        this.loading.next(true);
        this.handler.value.refreshData(data.dateSelection, group, data.peopleTypes, data.groupTypes).then(result => {
          this.loading.next(false);
          this.error.next(!result);
        });
      });
    });
  }

  setHandler(handler: DataProviderService): void {
    this.handler.next(handler);
  }

  isLoading$(): Observable<boolean> {
    return this.loading.asObservable();
  }

  hasError$(): Observable<boolean> {
    return this.error.asObservable();
  }
}
