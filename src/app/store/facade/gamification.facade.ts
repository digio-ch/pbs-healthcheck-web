import {Injectable} from '@angular/core';
import {WidgetState} from '../state/widget.state';
import {WidgetService} from '../services/widget.service';
import {map, take} from 'rxjs/operators';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {Widget} from '../../shared/models/widget';
import {DateSelection} from '../../shared/models/date-selection/date-selection';
import {Group} from '../../shared/models/group';
import {CensusFilterService, CensusFilterState} from '../services/census-filter.service';
import {GamificationService} from '../services/gamification.service';
import {ApiService} from '../../shared/services/api.service';
import {GroupFacade} from './group.facade';
import {Person} from '../../shared/models/person';
import {DefaultFilterFacade} from './default-filter.facade';

@Injectable({
  providedIn: 'root'
})
export class GamificationFacade {

  constructor(
    private apiService: ApiService,
    private gamificationService: GamificationService,
    private groupFacade: GroupFacade,
    private filterFacade: DefaultFilterFacade,
  ) {
    this.filterFacade.getUpdates$().subscribe(this.gamificationService.logFilterChanges());
  }

  public init() {
    console.log('INIT');
    this.filterFacade.getUpdates$().subscribe((e) => {
      console.log('filter changed', e);
    });
  }

  public fetchInitialData(person: Person, group: Group) {
    console.log('nothing');
  }

}
