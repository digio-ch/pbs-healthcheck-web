import { NgModule } from '@angular/core';
import { QuapAppComponent } from './components/quap-app/quap-app.component';
import { SharedModule } from '../../shared/shared.module';
import { AppsModule } from '../apps.module';
import { EvaluationViewComponent } from './components/evaluation-view/evaluation-view.component';
import { EvaluationQuestionComponent } from './components/evaluation-question/evaluation-question.component';
import { SummaryViewComponent } from './components/summary-view/summary-view.component';
import { DepartmentGraphViewComponent } from './components/graph-views/department-graph-view/department-graph-view.component';
import { DetailViewComponent } from './components/detail-view/detail-view.component';
import { SettingsViewComponent } from './components/settings-view/settings-view.component';
import { LegendComponent } from './components/graph-views/legend/legend.component';
import { GraphContainerComponent } from './components/graph-views/graph-container/graph-container.component';
import { QuapSharedAppComponent } from './components/quap-shared-app/quap-shared-app.component';
import { CantonGraphViewComponent } from './components/graph-views/canton-graph-view/canton-graph-view.component';
import { RouterModule } from '@angular/router';
import { QuapSharedAppShellComponent } from './components/quap-shared-app-shell/quap-shared-app-shell.component';
import { QuapSharedListApp } from './components/quap-shared-list-app/quap-shared-list-app';
import { QuapAppPreviewComponent } from './components/quap-app-preview/quap-app-preview.component';
import { QuapSharedAppPreviewComponent } from './components/quap-shared-app-preview/quap-shared-app-preview.component';
import { HierarchicalSummaryViewsComponent } from './components/hierarchical-summary-views/hierarchical-summary-views.component';
import { GamificationModule } from '../../gamification/gamification.module';

@NgModule({
    providers: [],
    imports: [
        SharedModule,
        AppsModule,
        RouterModule,
        GamificationModule,
        QuapAppComponent,
        EvaluationViewComponent,
        EvaluationQuestionComponent,
        SummaryViewComponent,
        DepartmentGraphViewComponent,
        DetailViewComponent,
        SettingsViewComponent,
        LegendComponent,
        GraphContainerComponent,
        QuapSharedAppComponent,
        CantonGraphViewComponent,
        QuapSharedAppShellComponent,
        QuapSharedListApp,
        QuapAppPreviewComponent,
        QuapSharedAppPreviewComponent,
        HierarchicalSummaryViewsComponent
    ],
    exports: [
        SummaryViewComponent,
        QuapAppPreviewComponent,
        QuapSharedAppPreviewComponent
    ],
})
export class QuapModule { }
