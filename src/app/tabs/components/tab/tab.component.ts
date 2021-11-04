import {Component, OnInit, Type} from '@angular/core';
import {TabService} from '../../services/tab.service';

@Component({
  selector: 'app-tab',
  template: '',
  styleUrls: []
})
export class TabComponent implements OnInit {

  data: any;

  constructor(
    protected tabService: TabService,
    private type: Type<TabComponent>,
  ) {
    this.tabService.register(type.name, type);
  }

  ngOnInit(): void {
  }

}
