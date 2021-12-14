import { Component, OnInit } from '@angular/core';
import {Tab} from '../../models/tab';
import {TabService} from '../../services/tab.service';

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss']
})
export class TabMenuComponent implements OnInit {
  tabs: Tab[];

  constructor(
    private tabService: TabService,
  ) { }

  ngOnInit(): void {
    this.tabService.getTabs$().subscribe(tabs => this.tabs = tabs);
  }

  isSelected(tag: string): boolean {
    return this.tabService.getSelectedTab().tag === tag;
  }

}
