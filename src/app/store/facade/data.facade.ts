import {Injectable} from "@angular/core";
import {DateSelection} from "../../shared/models/date-selection/date-selection";
import {Group} from "../../shared/models/group";
import {FilterFacade} from "./filter.facade";
import {GroupFacade} from "./group.facade";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataFacade {
  handler: BehaviorSubject<DataHandlerFacade> = new BehaviorSubject<DataHandlerFacade>(null);

  constructor(
    private filterFacade: FilterFacade,
    private groupFacade: GroupFacade,
  ) {
    this.filterFacade.getUpdates$().subscribe(data => {
      if (!this.handler.value) {
        return;
      }

      const group = this.groupFacade.getCurrentGroupSnapshot();
      setTimeout(() => this.handler.value.refreshData(data.dateSelection, group, data.peopleTypes, data.groupTypes));
    });
  }

  setHandler(handler: DataHandlerFacade): void {
    this.handler.next(handler);
  }
}

export interface DataHandlerFacade {
  refreshData(dateSelection: DateSelection, group: Group, peopleTypes: string[], groupTypes: string[]): void;
}
