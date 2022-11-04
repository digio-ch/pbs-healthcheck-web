import {NgModule} from '@angular/core';
import { QuapAppComponent } from './components/quap-app/quap-app.component';
import {SharedModule} from '../../shared/shared.module';
import {AppsModule} from '../apps.module';
import {EvaluationViewComponent} from './components/evaluation-view/evaluation-view.component';
import {EvaluationQuestionComponent} from './components/evaluation-question/evaluation-question.component';
import {SummaryViewComponent} from './components/summary-view/summary-view.component';
import {DepartmentGraphViewComponent} from './components/graph-views/department-graph-view/department-graph-view.component';
import {DetailViewComponent} from './components/detail-view/detail-view.component';
import {SettingsViewComponent} from './components/settings-view/settings-view.component';
import {LegendComponent} from './components/graph-views/legend/legend.component';
import {GraphContainerComponent} from './components/graph-views/graph-container/graph-container.component';
import {GraphDetailsComponent} from './components/graph-details/graph-details.component';
import {CantonGraphViewComponent} from './components/graph-views/canton-graph-view/canton-graph-view.component';
import {RouterModule} from '@angular/router';
import { QuapDepartmentsAppComponent } from './components/quap-departments-app/quap-departments-app.component';
import { SummaryGridComponent } from './components/summary-grid/summary-grid.component';
import { QuapAppPreviewComponent } from './components/quap-app-preview/quap-app-preview.component';

@NgModule({
  providers: [],
  declarations: [
    QuapAppComponent,
    EvaluationViewComponent,
    EvaluationQuestionComponent,
    SummaryViewComponent,
    DepartmentGraphViewComponent,
    DetailViewComponent,
    SettingsViewComponent,
    LegendComponent,
    GraphContainerComponent,
    GraphDetailsComponent,
    CantonGraphViewComponent,
    QuapDepartmentsAppComponent,
    SummaryGridComponent,
    QuapAppPreviewComponent,
  ],
  imports: [
    SharedModule,
    AppsModule,
    RouterModule
  ],
  exports: [
    SummaryViewComponent,
    QuapAppPreviewComponent
  ],
})
export class QuapModule { }
