import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Subscription} from 'rxjs';
import {GroupFacade} from '../../store/facade/group.facade';
import {Group} from '../../shared/models/group';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  @Input() absolute = false;
  @Input() hasData = true;
  @Input() importDate = 'unknown';
  @Input() skipLastImport = false;
  subscriptions: Subscription[] = [];
  currentGroup: Group;

  constructor(
    private groupFacade: GroupFacade,
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.groupFacade.getCurrentGroup$().subscribe(group => {
      this.currentGroup = group;
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get version(): string {
    return environment.version;
  }

}
