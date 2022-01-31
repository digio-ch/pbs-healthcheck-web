import {Component, ComponentFactoryResolver, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TabService} from '../../services/tab.service';
import {TabDirective} from '../../directives/tab.directive';
import {TabComponent} from '../tab/tab.component';
import {ActivatedRoute} from '@angular/router';
import {TabConfig} from '../../models/tab';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {DataProviderService} from '../../../shared/services/data-provider.service';

@Component({
  selector: 'app-tab-wrapper',
  templateUrl: './tab-wrapper.component.html',
  styleUrls: ['./tab-wrapper.component.scss']
})
export class TabWrapperComponent implements OnInit, OnDestroy {
  @ViewChild(TabDirective, { static: true }) tabDirective: TabDirective;

  config: TabConfig;

  dataHandler = new BehaviorSubject<DataProviderService>(null);

  subscriptions: Subscription[] = [];
  handlerSubscription: Subscription;

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

      this.config = this.tabService.getConfig();

      const dataProvider = this.injector.get(this.config.dataProvider);
      this.dataHandler.next(dataProvider);
    }));

    this.subscriptions.push(this.route.data.subscribe((data: { tag: string }) => {
      this.tabService.selectTab(data.tag);
    }));

    this.dataHandler.asObservable().subscribe(dataHandler => {
      if (this.handlerSubscription) {
        this.handlerSubscription.unsubscribe();
      }
      this.handlerSubscription = dataHandler.getData$().subscribe(data => {
        if (!data) {
          return;
        }
        this.updateData(data);
      });
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.handlerSubscription) {
      this.handlerSubscription.unsubscribe();
    }
  }

  get dataHandler$(): Observable<DataProviderService> {
    return this.dataHandler.asObservable();
  }

  updateData(data: any) {
    this.tabDirective.viewContainerRef.clear();

    const type = this.tabService.getTabType();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory<TabComponent>(type);
    const component = this.tabDirective.viewContainerRef.createComponent<TabComponent>(componentFactory);
    component.instance.data = data;
  }

}
