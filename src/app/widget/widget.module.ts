import { NgModule } from '@angular/core';
import { WidgetWrapperComponent } from './components/widget-wrapper/widget-wrapper.component';
import { WidgetComponent } from './components/widgets/widget/widget.component';
import { MembersGenderComponent } from './components/widgets/members-gender/members-gender.component';
import {SharedModule} from '../shared/shared.module';
import {GroupContextChangeComponent} from './components/dialogs/group-context-change/group-context-change.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { MembersGroupComponent } from './components/widgets/members-group/members-group.component';
import { AgeGroupDemographicComponent } from './components/widgets/age-group-demographic/age-group-demographic.component';
import {ChartModule} from '../chart/chart.module';
import { CampsComponent } from './components/widgets/camps/camps.component';
import {A11yModule} from '@angular/cdk/a11y';
import { MembersEnteredLeftComponent } from './components/widgets/members-entered-left/members-entered-left.component';
import { LeaderOverviewComponent } from './components/widgets/leader-overview/leader-overview.component';
import { LeaderOverviewCardComponent } from './components/widgets/leader-overview/leader-overview-card/leader-overview-card.component';
import { InviteDialogComponent } from './components/dialogs/invite-dialog/invite-dialog.component';
import { WidgetGridDirective } from './components/widget-wrapper/widget-grid.directive';
import { WidgetDirective } from './components/widget-wrapper/widget.directive';
import { LoadingWidgetGridComponent } from './components/loading-widget-grid/loading-widget-grid.component';
import { LeaderOverviewSectionComponent } from './components/widgets/leader-overview/leader-overview-section/leader-overview-section.component';
import { WidgetInfoComponent } from './components/widget-info/widget-info.component';
import { GeoLocationComponent } from './components/widgets/geo-location/geo-location.component';
import { QuapComponent } from './components/widgets/quap/quap.component';
import {RouterModule} from "@angular/router";
import {TabsModule} from '../tabs/tabs.module';

@NgModule({
  declarations: [
    WidgetWrapperComponent,
    WidgetComponent,
    MembersGenderComponent,
    GroupContextChangeComponent,
    MembersGroupComponent,
    AgeGroupDemographicComponent,
    CampsComponent,
    MembersEnteredLeftComponent,
    LeaderOverviewComponent,
    LeaderOverviewCardComponent,
    InviteDialogComponent,
    WidgetGridDirective,
    WidgetDirective,
    LoadingWidgetGridComponent,
    LeaderOverviewSectionComponent,
    WidgetInfoComponent,
    GeoLocationComponent,
    QuapComponent
  ],
  exports: [
    WidgetWrapperComponent,
  ],
    imports: [
        SharedModule,
        NgxChartsModule,
        ChartModule,
        A11yModule,
        RouterModule,
        TabsModule,
    ],
  providers: [
    {
      provide: 'widgets',
      useValue: [
        LeaderOverviewComponent,
        MembersGenderComponent,
        MembersGroupComponent,
        AgeGroupDemographicComponent,
        CampsComponent,
        MembersEnteredLeftComponent,
        GeoLocationComponent,
        QuapComponent
      ]
    }
  ]
})
export class WidgetModule { }
