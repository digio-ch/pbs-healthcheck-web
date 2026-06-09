import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { combineLatest, merge, of, Subject, Subscription } from 'rxjs';
import { QuapSettings, QuapSettingsService } from '../../services/quap-settings.service';
import { QuapService } from '../../services/quap.service';
import { DateFacade } from '../../../../store/facade/date.facade';
import { first, takeUntil } from 'rxjs/operators';
import { GroupFacade } from '../../../../store/facade/group.facade';
import { Questionnaire } from '../../models/questionnaire';
import { AnswerStack } from '../../models/question';
import { GraphContainerComponent } from '../graph-views/graph-container/graph-container.component';
import { Group } from '../../../../shared/models/group';
import { DateSelection } from '../../../../shared/models/date-selection/date-selection';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { DatePickerInputComponent } from '../../../../shared/components/filters/date-picker-input/date-picker-input.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { InfoComponent } from '../../../../shared/components/info/info.component';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-quap-app',
    templateUrl: './quap-app.component.html',
    styleUrls: ['./quap-app.component.scss'],
    imports: [NgIf, DatePickerInputComponent, LoadingComponent, InfoComponent, MatIconButton, MatIcon, GraphContainerComponent, TranslatePipe]
})
export class QuapAppComponent implements OnInit, OnDestroy {
  @ViewChild(GraphContainerComponent) graphContainer: GraphContainerComponent;

  questionnaire: Questionnaire;
  answers: AnswerStack;
  computedAnswers: AnswerStack;
  settings: QuapSettings;

  group: Group;

  loadedDate: boolean;

  private destroyed$ = new Subject();

  constructor(
    private groupFacade: GroupFacade,
    private dateFacade: DateFacade,
    private quapService: QuapService,
    private quapSettingsService: QuapSettingsService,
    private translateService: TranslateService,
  ) { }

  get loading(): boolean {
    return this.questionnaire == null || this.answers == null;
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
}
