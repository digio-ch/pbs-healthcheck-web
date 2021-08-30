import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TabComponent} from '../../../tab/tab.component';
import {TabService} from '../../../../services/tab.service';
import {DialogService} from '../../../../../shared/services/dialog.service';
import {Questionnaire} from '../models/questionnaire';
import {AnswerOption, AnswerStack, AnswerType} from '../models/question';
import {PopupService} from '../../../../../shared/services/popup.service';
import {AnswerState} from '../store/answer.state';
import {QuestionnaireState} from '../store/questionnaire.state';
import {Aspect} from '../models/aspect';
import {QuapService} from '../services/quap.service';
import {FilterFacade} from '../../../../../store/facade/filter.facade';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-quap-tab',
  templateUrl: './quap-tab.component.html',
  styleUrls: ['./quap-tab.component.scss']
})
export class QuapTabComponent extends TabComponent implements OnInit, OnDestroy {
  public static TAB_CLASS_NAME = 'QuapTabComponent';

  @ViewChild('evaluationView', { static: true }) evaluationView: TemplateRef<any>;
  @ViewChild('detailView', { static: true }) detailView: TemplateRef<any>;
  @ViewChild('settingsView', { static: true }) settingsView: TemplateRef<any>;

  questionnaire: Questionnaire;
  answers: AnswerStack;

  private selectedAspects: Aspect[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    protected tabService: TabService,
    private dialogService: DialogService,
    private popupService: PopupService,
    private quapService: QuapService,
    private filterFacade: FilterFacade,
    private questionnaireState: QuestionnaireState,
    private answerState: AnswerState,
  ) {
    super(tabService, QuapTabComponent);
  }

  ngOnInit(): void {
    this.subscriptions.push(this.questionnaireState.getQuestionnaire$().subscribe(questionnaire => this.questionnaire = questionnaire));
    this.subscriptions.push(this.answerState.getAnswers$().subscribe(answers => this.answers = answers));

    this.questionnaireState.setQuestionnaire({
      id: 1,
      aspects: [
        {id: 1, name: 'Programm', description: 'Lorem Ipsum', questions: []},
        {id: 2, name: 'Erfüllung', description: 'Lorem Ipsum', questions: []},
        {id: 3, name: 'Zufriedenheit', description: 'Lorem Ipsum', questions: []},
        {id: 4, name: 'Image', description: 'Lorem Ipsum', questions: []},
        {id: 5, name: 'Werbung', description: 'Lorem Ipsum', questions: [
            {
              id: 1,
              question: 'is this a test?',
              answerOptions: AnswerType.BINARY,
              help: [
                {
                  help: 'help for q1',
                  severity: 1,
                  links: [
                    {
                      name: 'Test link 1',
                      url: 'https://google.com',
                    },
                    {
                      name: 'Test link 2',
                      url: 'https://example.com',
                    },
                  ],
                },
              ],
            },
            {
              id: 2,
              question: 'is this a test?',
              answerOptions: AnswerType.RANGE,
              help: [
                {
                  help: 'Test help text 2',
                  severity: 2
                },
                {
                  help: 'Test help text 3',
                  severity: 3
                },
                {
                  help: 'Test help text 4',
                  severity: 4
                },
              ],
            },
            {
              id: 3,
              question: 'is this a test?',
              answerOptions: AnswerType.RANGE,
              help: [
                {
                  help: 'help for q3',
                  severity: 1
                },
                {
                  help: 'special help for q3',
                  severity: 2
                },
              ],
            },
            {
              id: 4,
              question: 'is this a test?',
              answerOptions: AnswerType.MIDATA_RANGE,
              help: [
                {
                  help: 'help',
                  severity: 1,
                },
              ],
            },
            {
              id: 5,
              question: 'is this a test?',
              answerOptions: AnswerType.RANGE,
              help: [
                {
                  help: 'help',
                  severity: 1,
                },
              ],
            },
            {
              id: 6,
              question: 'is this a test?',
              answerOptions: AnswerType.RANGE,
              help: [
                {
                  help: 'help',
                  severity: 1,
                },
              ],
            },
          ]},
        {id: 6, name: 'Ressourcen', description: 'Lorem Ipsum', questions: []},
        {id: 7, name: 'Zahl', description: 'Lorem Ipsum', questions: []},
        {id: 8, name: 'Austausch', description: 'Lorem Ipsum', questions: [
            {
              id: 1,
              question: 'is this a test?',
              answerOptions: AnswerType.RANGE,
              help: [
                {
                  help: 'help',
                  severity: 1,
                },
              ],
            },
            {
              id: 2,
              question: 'is this a test?',
              answerOptions: AnswerType.RANGE,
              help: [
                {
                  help: 'help',
                  severity: 1,
                },
              ],
            },
            {
              id: 3,
              question: 'is this a test?',
              answerOptions: AnswerType.RANGE,
              help: [
                {
                  help: 'help',
                  severity: 1,
                },
              ],
            },
          ]},
        {id: 9, name: 'Netzwerk', description: 'Lorem Ipsum', questions: []},
        {id: 10, name: 'Bildung', description: 'Lorem Ipsum', questions: [
            {
              id: 1,
              question: 'is this a test?',
              answerOptions: AnswerType.RANGE,
              help: [
                {
                  help: 'help',
                  severity: 1,
                },
              ],
            },
            {
              id: 2,
              question: 'is this a test?',
              answerOptions: AnswerType.RANGE,
              help: [
                {
                  help: 'help',
                  severity: 1,
                },
              ],
            },
            {
              id: 3,
              question: 'is this a test?',
              answerOptions: AnswerType.RANGE,
              help: [
                {
                  help: 'help',
                  severity: 1,
                },
              ],
            },
          ]},
        {id: 11, name: 'Motivation', description: 'Lorem Ipsum', questions: []},
        {id: 12, name: 'Kultur', description: 'Lorem Ipsum', questions: [
            {
              id: 5,
              question: 'This is indeed a test',
              answerOptions: AnswerType.BINARY,
              help: [
                {
                  help: 'help',
                  severity: 1,
                },
              ],
            },
            {
              id: 6,
              question: 'is this a test?',
              answerOptions: AnswerType.MIDATA,
              help: [
                {
                  help: 'help',
                  severity: 1,
                },
              ],
            },
            {
              id: 7,
              question: 'is this a test?',
              answerOptions: AnswerType.RANGE,
              help: [
                {
                  help: 'help',
                  severity: 1,
                },
              ],
            },
            {
              id: 8,
              question: 'is this a test?',
              answerOptions: AnswerType.RANGE,
              help: [
                {
                  help: 'help',
                  severity: 1,
                },
              ],
            },
          ]},
        {id: 13, name: 'Team', description: 'Lorem Ipsum', questions: []},
        {id: 14, name: 'Programm', description: 'Lorem Ipsum', questions: []},
        {id: 15, name: 'Profil', description: 'Lorem Ipsum', questions: []},
        {id: 16, name: 'Betreuung', description: 'Lorem Ipsum', questions: [
            {
              id: 1,
              question: 'is this a test?',
              answerOptions: AnswerType.RANGE,
              help: [
                {
                  help: 'help',
                  severity: 3,
                },
                {
                  help: 'help',
                  severity: 4,
                },
              ],
            },
            {
              id: 2,
              question: 'This is a test.',
              answerOptions: AnswerType.RANGE,
              help: [
                {
                  help: 'Test help text 1',
                  severity: 1
                },
                {
                  help: 'Test help text 2',
                  severity: 2
                },
                {
                  help: 'Test help text 3',
                  severity: 3
                },
                {
                  help: 'Test help text 4',
                  severity: 4
                },
                {
                  help: 'Test help text 5',
                  severity: 5
                },
              ],
            },
            {
              id: 3,
              question: 'is this a test?',
              answerOptions: AnswerType.RANGE,
              help: [
                {
                  help: 'help',
                  severity: 1,
                },
              ],
            },
          ]},
      ]
    });

    // TODO reenable this as soon as enough example data is provided
    // this.questionnaireState.setQuestionnaire(this.data[0]);
    this.answerState.setAnswers(this.processAnswers(this.data[1]));
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

    const dialogSubscription = this.dialogService.open(this.evaluationView, { disableClose: true });

    dialogSubscription.onCloseRequest(() => {
      if (!this.filterFacade.isTodaySelected()) {
        return Promise.resolve(true);
      }

      return this.popupService.open({
        title: 'dialog.quap.unsaved_changes.title',
        message: 'dialog.quap.unsaved_changes.message',
      }).then(result => {
        return result;
      });
    });
  }

  openDetailDialog(index?: number): void {
    if (index !== undefined) {
      this.selectedAspects = [ this.questionnaire.aspects[index] ];
    } else {
      this.selectedAspects = [];
    }

    const dialogSubscription = this.dialogService.open(this.detailView);

    dialogSubscription.afterClosed(result => {
      if (!result) {
        return;
      }

      if ('switchTab' in result && result.switchTab === true) {
        this.openEvaluationDialog(index);
      }
    });
  }

  openSettingsDialog(): void {
    this.dialogService.open(this.settingsView);
  }
}
