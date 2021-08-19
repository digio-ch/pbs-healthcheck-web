import {Component, ComponentFactoryResolver, OnInit, ViewChild} from '@angular/core';
import {TabService} from "../../services/tab.service";
import {TabDirective} from "../../directives/tab.directive";
import {TabComponent} from "../tab/tab.component";
import {ActivatedRoute} from "@angular/router";
import {TabConfig} from '../../../shared/models/tab';

@Component({
  selector: 'app-tab-wrapper',
  templateUrl: './tab-wrapper.component.html',
  styleUrls: ['./tab-wrapper.component.scss']
})
export class TabWrapperComponent implements OnInit {
  @ViewChild(TabDirective, { static: true }) tabDirective: TabDirective;

  config: TabConfig;
  loading = false;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private tabService: TabService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.tabService.getSelectedTabClass$().subscribe(value => {
      if (!value) {
        return;
      }
      this.updateView();
    });

    this.route.params.subscribe((params: { tag: string }) => {
      this.tabService.selectTab(params.tag);
    });
  }

  updateView() {
    this.tabDirective.viewContainerRef.clear();

    this.config = this.tabService.getConfig();

    this.loading = true;
    this.config.dataLoader().then(result => {
      const type = this.tabService.getTabType();
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory<TabComponent>(type);
      const component = this.tabDirective.viewContainerRef.createComponent<TabComponent>(componentFactory);
      component.instance.data = result;
      this.loading = false;
    });
  }

}
