import { Component, ViewChild, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, firstValueFrom } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { DefaultFilterFacade } from '../../../../store/facade/default-filter.facade';
import { QuapSettingsService } from '../../services/quap-settings.service';
import { QuapService } from '../../services/quap.service';
import { SharedAnswerState } from '../../state/shared-answer.state';
import { GraphContainerComponent } from '../graph-views/graph-container/graph-container.component';

import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { InfoComponent } from '../../../../shared/components/info/info.component';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import moment from 'moment';
import { DateFacade } from 'src/app/store/facade/date.facade';
import { GroupFacade } from 'src/app/store/facade/group.facade';
import { DatePickerInputComponent } from "src/app/shared/components/filters/date-picker-input/date-picker-input.component";
import { ExportButtonComponent } from "../export-button/export-button.component";
import { QuapExportFacade } from '../../facades/quap-export.facade';

@Component({
    selector: 'app-quap-shared-app',
    templateUrl: './quap-shared-app.component.html',
    styleUrls: ['./quap-shared-app.component.scss'],
    imports: [LoadingComponent, InfoComponent, MatIconButton, MatIcon, GraphContainerComponent, TranslatePipe, DatePickerInputComponent, ExportButtonComponent]
})
export class QuapSharedAppComponent {
  private route = inject(ActivatedRoute);
  private dateFacade = inject(DateFacade);
  private filterFacade = inject(DefaultFilterFacade);
  private exportFacade = inject(QuapExportFacade);
  private groupFacade = inject(GroupFacade);
  private quapService = inject(QuapService);
  private quapSettingsService = inject(QuapSettingsService);
  readonly sharedAnswerState = inject(SharedAnswerState);

  readonly isFilterLoading = toSignal(
    this.dateFacade.getDateSelection$().pipe(
      map(dateSelection => dateSelection.isRange),
    ),
    {
      initialValue: true,
    }
  );

  readonly date = toSignal(
    this.dateFacade.getDateSelection$().pipe(
      map(selection => selection.startDate)
    ),
    {
      initialValue: moment(),
    }
  );

  readonly group = toSignal(
    this.groupFacade.getCurrentGroup$()
  );

  readonly settings = toSignal(
    this.quapSettingsService.getSettings$(),
  );

  @ViewChild(GraphContainerComponent) graphContainer: GraphContainerComponent;

  private subordinateGroupId$ = this.route.params.pipe(
    map((params: { id: number }) => +params.id),
  );

  private data$ = this.subordinateGroupId$.pipe(
    switchMap(id => this.sharedAnswerState.getAnswersFromGroup$(id)),
  );

  readonly isQuestionnaireLoading = signal(true);

  private questionnaire$ = combineLatest([
    this.data$,
    this.filterFacade.getDateSelection$(),
  ]).pipe(
    filter(([data, _]) => !!data),
    tap(() => this.isQuestionnaireLoading.set(true)),
    switchMap(([data, selection]) => this.quapService.getQuestionnaire(selection, data.groupType).pipe(
      tap(() => this.isQuestionnaireLoading.set(false)),
    )),
  );

  readonly data = toSignal(this.data$);
  readonly questionnaire = toSignal(this.questionnaire$);

  openEvaluationDialog(index?: number, origin?: string): void {
    this.graphContainer.openEvaluationDialog(index, origin);
  }

  openDetailDialog(index?: number, origin?: string): void {
    this.graphContainer.openDetailDialog(index, origin);
  }

  openSettingsDialog(): void {
    this.graphContainer.openSettingsDialog();
  }


  async onExport() {
    if (!this.group()) {
      return;
    }

    const subordinateGroupId = await firstValueFrom(this.subordinateGroupId$);

    this.exportFacade.exportSharedQuap(
      this.group().id,
      subordinateGroupId, 
      this.date()
    );
  }
}
