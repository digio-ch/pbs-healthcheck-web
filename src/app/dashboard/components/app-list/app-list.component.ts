import { Component, inject, Input } from '@angular/core';
import { AppModel } from '../../../models/app.model';
import { Router } from '@angular/router';
import { DashBoardSection } from 'src/app/models/dashboard-layout.model';

import { WidgetsAppPreviewComponent } from '../../../apps/widget/components/widgets/widgets-app-preview/widgets-app-preview.component';
import { QuapAppPreviewComponent } from '../../../apps/quap/components/quap-app-preview/quap-app-preview.component';
import { QuapDepartmentsAppPreviewComponent } from '../../../apps/quap/components/quap-departments-app-preview/quap-departments-app-preview.component';
import { CensusAppPreviewComponent } from '../../../apps/widget/components/widgets/census-app-preview/census-app-preview.component';
import { OverviewDepartmentsAppPreviewComponent } from '../../../apps/widget/components/overview-departments-app-preview/overview-departments-preview-app.component';
import { TranslatePipe } from '@ngx-translate/core';
import { MyOrganizationPreviewChartComponent } from 'src/app/apps/my-organization/components/preview/my-organization-preview-chart/my-organization-preview-chart.component';
import { MyOrganizationPreviewTooltipComponent } from "src/app/apps/my-organization/components/preview/my-organization-preview-tooltip/my-organization-preview-tooltip.component";
import { MyOrganizationPreviewStore } from 'src/app/apps/my-organization/stores/my-ogranization-preview.store';

@Component({
    providers: [MyOrganizationPreviewStore],
    selector: 'app-app-list',
    templateUrl: './app-list.component.html',
    styleUrls: ['./app-list.component.scss'],
    imports: [WidgetsAppPreviewComponent, QuapAppPreviewComponent, QuapDepartmentsAppPreviewComponent, CensusAppPreviewComponent, OverviewDepartmentsAppPreviewComponent, TranslatePipe, MyOrganizationPreviewChartComponent, MyOrganizationPreviewTooltipComponent]
})
export class AppListComponent {
  private router = inject(Router);

  @Input() layout: DashBoardSection[];

  goTo(app: AppModel): void {
    this.router.navigate(['app', app.path]);
  }

  getTranslationKey(app: AppModel): string {
    return `apps.${app.key}.name`;
  }
}
