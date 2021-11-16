import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TabComponent} from '../../../tab/tab.component';
import {TabService} from '../../../../services/tab.service';
import {DialogController, DialogService} from '../../../../../shared/services/dialog.service';
import {Questionnaire} from '../models/questionnaire';
import {AnswerOption, AnswerStack, AnswerType} from '../models/question';
import {PopupService} from '../../../../../shared/services/popup.service';
import {AnswerState} from '../store/answer.state';
import {QuestionnaireState} from '../store/questionnaire.state';
import {Aspect} from '../models/aspect';
import {QuapService} from '../services/quap.service';
import {FilterFacade} from '../../../../../store/facade/filter.facade';
import {Subscription} from 'rxjs';
import {QuapSettings, QuapSettingsService} from '../services/quap-settings.service';

@Component({
  selector: 'app-quap-tab',
  templateUrl: './quap-tab.component.html',
  styleUrls: ['./quap-tab.component.scss']
})
export class QuapTabComponent extends TabComponent implements OnInit, OnDestroy, DialogController {
  public static TAB_CLASS_NAME = 'QuapTabComponent';

  @ViewChild('evaluationView', { static: true }) evaluationView: TemplateRef<any>;
  @ViewChild('detailView', { static: true }) detailView: TemplateRef<any>;
  @ViewChild('settingsView', { static: true }) settingsView: TemplateRef<any>;

  questionnaire: Questionnaire;
  answers: AnswerStack;
  settings: QuapSettings;

  private selectedAspects: Aspect[] = [];
  private selectedIndex: number|null;

  private subscriptions: Subscription[] = [];

  constructor(
    protected tabService: TabService,
    private dialogService: DialogService,
    private popupService: PopupService,
    private quapService: QuapService,
    private filterFacade: FilterFacade,
    private questionnaireState: QuestionnaireState,
    private answerState: AnswerState,
    private quapSettingsService: QuapSettingsService
  ) {
    super(tabService, QuapTabComponent);
  }

  ngOnInit(): void {
    this.subscriptions.push(this.questionnaireState.getQuestionnaire$().subscribe(questionnaire => this.questionnaire = questionnaire));
    this.subscriptions.push(this.answerState.getAnswers$().subscribe(answers => this.answers = answers));

    this.questionnaireState.setQuestionnaire(this.data[0]);
    this.answerState.setAnswers(this.processAnswers(this.data[1]));

    this.quapSettingsService.getSettings$().subscribe(settings => this.settings = settings);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // clean up the answer stack (in case a question got deleted from the questionnaire)
  processAnswers(answerStack: AnswerStack): AnswerStack {
    const validatedAnswerStack: AnswerStack = {};

    this.questionnaire.aspects.forEach(aspect => {
      if (aspect.questions.length === 0) {
        return;
      }
      validatedAnswerStack[aspect.id] = {};

      aspect.questions.forEach(question => {
        validatedAnswerStack[aspect.id][question.id] =
          aspect.id in answerStack && question.id in answerStack[aspect.id]
            ?
            answerStack[aspect.id][question.id]
            :
            AnswerOption.NOT_ANSWERED;
      });
    });

    return validatedAnswerStack;
  }

  getSelectedAspects(): Aspect[] {
    if (this.selectedAspects.length > 0) {
      return this.selectedAspects;
    }
    return this.questionnaire.aspects;
  }

  openEvaluationDialog(index?: number): void {
    if (index !== undefined) {
      this.selectedAspects = [ this.questionnaire.aspects[index] ];
    } else {
      this.selectedAspects = [];
    }

    this.dialogService.open(this.evaluationView, { disableClose: true });
    this.dialogService.addDialogController(this);
  }

  openDetailDialog(index?: number): void {
    this.selectedIndex = index;
    if (index !== undefined) {
      this.selectedAspects = [ this.questionnaire.aspects[index] ];
    } else {
      this.selectedAspects = [];
    }

    this.dialogService.open(this.detailView);
    this.dialogService.addDialogController(this);
  }

  openSettingsDialog(): void {
    this.dialogService.open(this.settingsView);
  }

  onCloseRequest(): Promise<boolean> {
    return Promise.resolve(true);
  }

  beforeClosed(result: any) {}

  afterClosed(result: any) {
    if (!result) {
      return;
    }

    if ('switchTab' in result && result.switchTab === true) {
      this.openEvaluationDialog(this.selectedIndex);
    }
  }
}
