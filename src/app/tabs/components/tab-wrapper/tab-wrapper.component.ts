import {Component, ComponentFactoryResolver, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TabService} from "../../services/tab.service";
import {TabDirective} from "../../directives/tab.directive";
import {TabComponent} from "../tab/tab.component";
import {ActivatedRoute} from "@angular/router";
import {TabConfig} from '../../models/tab';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {DateSelection} from '../../../shared/models/date-selection/date-selection';

@Component({
  selector: 'app-tab-wrapper',
  templateUrl: './tab-wrapper.component.html',
  styleUrls: ['./tab-wrapper.component.scss']
})
export class TabWrapperComponent implements OnInit, OnDestroy {
  @ViewChild(TabDirective, { static: true }) tabDirective: TabDirective;

  config: TabConfig;

  updateData = new BehaviorSubject<boolean>(false);
  loadingStatus = new BehaviorSubject<any>(false);

  subscriptions: Subscription[] = [];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private tabService: TabService,
    private route: ActivatedRoute,
    private injector: Injector,
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.tabService.getSelectedTabClass$().subscribe(value => {
      if (!value) {
        return;
      }

      this.updateData.next(!this.updateData.value);
    }));

    this.subscriptions.push(this.route.params.subscribe((params: { tag: string }) => {
      this.tabService.selectTab(params.tag);
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get updateData$(): Observable<any> {
    return this.updateData.asObservable();
  }

  get loadingStatus$(): Observable<any> {
    return this.loadingStatus.asObservable();
  }

  loadData(dateSelection: DateSelection) {
    this.tabDirective.viewContainerRef.clear();

    this.config = this.tabService.getConfig();

    const dataProvider = this.injector.get(this.config.dataProvider);

    dataProvider.loadData().then(result => {
      const type = this.tabService.getTabType();
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory<TabComponent>(type);
      const component = this.tabDirective.viewContainerRef.createComponent<TabComponent>(componentFactory);
      component.instance.data = result;

      this.loadingStatus.next({
        data: true,
        error: null,
      });
    }).catch(error => {
      this.loadingStatus.next({
        data: null,
        error: true,
      });
    });
  }

}
