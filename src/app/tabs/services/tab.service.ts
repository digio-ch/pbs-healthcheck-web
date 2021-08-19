import {Inject, Injectable, Type} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {TabComponent} from "../components/tab/tab.component";
import {Tab, TabConfig} from "../../shared/models/tab";

@Injectable({
  providedIn: 'root'
})
export class TabService {
  private tabRegistry = new Map<string, Type<TabComponent>>();
  private selectedTab: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  private tabs: BehaviorSubject<Tab[]> = new BehaviorSubject<Tab[]>([
    {
      tag: 'quap',
      name: 'QUAP 2.0',
      className: 'QuapTabComponent',
      config: {
        datePicker: {
          datePoint: true,
          dateRange: false,
        },
        dataLoader: () => new BehaviorSubject<any>(null).asObservable().toPromise(),
      },
    },
  ]);

  constructor(@Inject('tabs') tabs) {
    for (const tab of tabs) {
      this.register(tab.TAB_CLASS_NAME, tab);
    }
  }

  getTab(tag: string): Tab {
    return this.tabs.value.find(tab => tab.tag === tag);
  }

  selectTab(tag: string): void {
    const tab = this.getTab(tag);
    if (!tab) {
      return;
    }
    this.selectedTab.next(tab.className);
  }

  getTabs$(): Observable<Tab[]> {
    return this.tabs.asObservable();
  }

  getSelectedTabClass$(): Observable<string> {
    return this.selectedTab.asObservable();
  }

  getSelectedTabClass(): string {
    return this.selectedTab.value;
  }

  getSelectedTab(): Tab {
    return this.tabs.value.find(tab => tab.className === this.getSelectedTabClass());
  }

  register(name: string, type: Type<TabComponent>): void {
    this.tabRegistry.set(name, type);
  }

  getTabType(): Type<TabComponent> {
    return this.tabRegistry.get(this.selectedTab.value);
  }

  getConfig(): TabConfig {
    return this.getSelectedTab().config;
  }
}
