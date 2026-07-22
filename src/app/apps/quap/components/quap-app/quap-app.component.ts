import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { combineLatest, merge, of, Subject, Subscription } from 'rxjs';
import { QuapSettings, QuapSettingsService } from '../../services/quap-settings.service';
import { QuapService } from '../../services/quap.service';
import { DateFacade } from '../../../../store/facade/date.facade';
import { first, map, takeUntil } from 'rxjs/operators';
import { GroupFacade } from '../../../../store/facade/group.facade';
import { Questionnaire } from '../../models/questionnaire';
import { AnswerStack } from '../../models/question';
import { GraphContainerComponent } from '../graph-views/graph-container/graph-container.component';
import { Group } from '../../../../shared/models/group';
import { DateSelection } from '../../../../shared/models/date-selection/date-selection';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

import { DatePickerInputComponent } from '../../../../shared/components/filters/date-picker-input/date-picker-input.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { InfoComponent } from '../../../../shared/components/info/info.component';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { toSignal } from '@angular/core/rxjs-interop';
import moment from 'moment';
import { ASPECT_IDS_BY_QUESTIONNAIRE_TYPE } from '../../models/aspect';
import { ExportButtonComponent } from "../export-button/export-button.component";
import { QuapExportFacade } from '../../facades/quap-export.facade';

@Component({
    providers: [QuapExportFacade],
    selector: 'app-quap-app',
    templateUrl: './quap-app.component.html',
    styleUrls: ['./quap-app.component.scss'],
    imports: [DatePickerInputComponent, LoadingComponent, InfoComponent, MatIconButton, MatIcon, GraphContainerComponent, TranslatePipe, ExportButtonComponent]
})
export class QuapAppComponent implements OnInit, OnDestroy {
  private groupFacade = inject(GroupFacade);
  private dateFacade = inject(DateFacade);
  private exportFacade = inject(QuapExportFacade);
  private quapService = inject(QuapService);
  private quapSettingsService = inject(QuapSettingsService);
  private translateService = inject(TranslateService);

  readonly date = toSignal(
    this.dateFacade.getDateSelection$().pipe(
      map(selection => selection.startDate)
    ),
    {
      initialValue: moment(),
    }
  );

  @ViewChild(GraphContainerComponent) graphContainer: GraphContainerComponent;

  questionnaire: Questionnaire;
  answers: AnswerStack;
  computedAnswers: AnswerStack;
  settings: QuapSettings;

  group: Group;

  loadedDate: boolean;

  private destroyed$ = new Subject();

  get loading(): boolean {
    return this.questionnaire == null || this.answers == null;
  }

  get isEmpty(): boolean {
    return this.questionnaire === null || this.questionnaire.aspects.length === 0;
  }

  get editRights(): boolean {
    return this.group.permissionType === Group.PERMISSION_TYPE_OWNER ||
      this.group.permissionType === Group.PERMISSION_TYPE_EDITOR_PLUS ||
      this.group.permissionType === Group.PERMISSION_TYPE_EDITOR;
  }

  ngOnInit(): void {

    const subscriptions: Subscription[] = [];

    const langSwitch$ = merge(
      of(null), // trigger if the page is loaded after the initial onLangChange
      this.translateService.onLangChange
    );

    combineLatest([
      this.groupFacade.getCurrentGroup$(),
      this.dateFacade.getDateSelection$(),
      langSwitch$,
    ]).pipe(
      takeUntil(this.destroyed$),
    ).subscribe(([group, dateSelection]) => {
      this.group = group;

      if (dateSelection == null) {
        return;
      }
      if (dateSelection.isRange) {
        this.dateFacade.setDateSelection(new DateSelection(dateSelection.startDate, null, false));
        return;
      }
      this.loadedDate = true;

      while (subscriptions.length > 0) {
        subscriptions.pop().unsubscribe();
      }

      this.questionnaire = null;
      this.answers = null;
      this.computedAnswers = null;
      this.settings = null;

      subscriptions.push(this.quapService.getQuestionnaire(dateSelection, group.groupType.groupType).pipe(
        first(),
        map((questionnaire: Questionnaire) => {
          const allowedIds = ASPECT_IDS_BY_QUESTIONNAIRE_TYPE[questionnaire.type];

          return {
            ...questionnaire,
            aspects: questionnaire.aspects.filter(aspect => allowedIds.includes(aspect.id))
          }
        })
      ).subscribe(questionnaire => this.questionnaire = questionnaire));
      subscriptions.push(this.quapService.getAnswers(dateSelection, group.id).pipe(
        first(),
      ).subscribe(answerData => {
        this.answers = answerData.answers;
        this.computedAnswers = answerData.computedAnswers;
        this.quapSettingsService.setSettingShareData(answerData.shareAccess);
      }));
    });

    this.quapSettingsService.getSettings$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(settings => this.settings = settings);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

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
    if (!this.group || this.isEmpty) {
      return;
    }

    this.exportFacade.exportQuap(this.group.id, this.date());
  }
}
