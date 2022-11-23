import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DialogController, DialogService} from '../../../../../shared/services/dialog.service';
import {Aspect} from '../../../models/aspect';
import {Questionnaire} from '../../../models/questionnaire';
import {AnswerOption, AnswerStack} from '../../../models/question';
import {CalculationHelper} from '../../../services/calculation.helper';
import {AnswerState} from '../../../state/answer.state';
import {QuestionnaireState} from '../../../state/questionnaire.state';
import {GroupFacade} from '../../../../../store/facade/group.facade';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {GroupType} from '../../../../../shared/models/group-type';

@Component({
  selector: 'app-graph-container',
  templateUrl: './graph-container.component.html',
  styleUrls: ['./graph-container.component.scss']
})
export class GraphContainerComponent implements OnInit, OnDestroy, DialogController {

  @ViewChild('evaluationView', { static: true }) evaluationView: TemplateRef<any>;
  @ViewChild('detailView', { static: true }) detailView: TemplateRef<any>;
  @ViewChild('settingsView', { static: true }) settingsView: TemplateRef<any>;

  @Input() questionnaire: Questionnaire;
  @Input() answers: AnswerStack;
  @Input() computedAnswers: AnswerStack;
  @Input() disabled: boolean;
  @Input() groupType: string;

  validatedAnswers: AnswerStack;

  private selectedAspects: Aspect[] = [];
  private selectedIndex: number|null;
  private currentDialogOrigin: string|null;

  private destroyed$ = new Subject();

  constructor(
    private dialogService: DialogService,
    private questionnaireState: QuestionnaireState,
    private answerState: AnswerState,
  ) { }

  get isDepartment(): boolean {
    return this.groupType === GroupType.DEPARTMENT_KEY;
  }

  ngOnInit(): void {
    this.questionnaireState.setQuestionnaire(this.questionnaire);
    this.answerState.setAnswers(this.processAnswers({
      answers: this.answers,
      computedAnswers: this.computedAnswers,
    }));
    this.answerState.getAnswers$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(answers => {
      this.validatedAnswers = answers;
    })
    this.answerState.setComputedAnswers(this.computedAnswers);
  }

  // clean up the answer stack (in case a question got deleted from the questionnaire)
  processAnswers(data: { answers: AnswerStack, computedAnswers: AnswerStack }): AnswerStack {
    const validatedAnswerStack: AnswerStack = {};

    const answerStack: AnswerStack = data.answers;

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

    // adding computed answers to answer stack
    return CalculationHelper.combineAnswerStacks(validatedAnswerStack, data.computedAnswers);
  }

  getSelectedAspects(): Aspect[] {
    if (this.selectedAspects.length > 0) {
      return this.selectedAspects;
    }
    return this.questionnaire.aspects;
  }

  getOrigin(): string {
    if (this.currentDialogOrigin) {
      return this.currentDialogOrigin;
    }
    return 'overview';
  }

  openEvaluationDialog(index?: number, origin?: string): void {
    if (index !== undefined) {
      this.selectedAspects = [ this.questionnaire.aspects[index] ];
    } else {
      this.selectedAspects = [];
    }

    this.currentDialogOrigin = origin;

    this.dialogService.open(this.evaluationView, { disableClose: true });
    this.dialogService.addDialogController(this);
  }

  openDetailDialog(index?: number, origin?: string): void {
    this.selectedIndex = index;
    if (index !== undefined) {
      this.selectedAspects = [ this.questionnaire.aspects[index] ];
    } else {
      this.selectedAspects = [];
    }

    this.currentDialogOrigin = origin;

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

    if ('goto' in result) {
      switch (result.goto.to) {
        case 'evaluation':
          this.openEvaluationDialog(this.selectedIndex, result.goto.from);
          break;
        case 'detail':
          this.openDetailDialog(this.selectedIndex, result.goto.from);
          break;
        default:
          // goto overview
          break;
      }
    } else if ('returnTo' in result) {
      switch (result.returnTo) {
        case 'evaluation':
          this.openEvaluationDialog(this.selectedIndex);
          break;
        case 'detail':
          this.openDetailDialog(this.selectedIndex);
          break;
        default:
          // goto overview
          break;
      }
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
