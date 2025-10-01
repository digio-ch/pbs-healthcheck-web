import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Aspect} from '../../../models/aspect';
import {AnswerStack} from '../../../models/question';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {CalculationHelper, Summary} from '../../../services/calculation.helper';
import {QuestionnaireState} from '../../../state/questionnaire.state';
import {AnswerState} from '../../../state/answer.state';

@Component({
  selector: 'app-canton-graph-view',
  templateUrl: './canton-graph-view.component.html',
  styleUrls: ['./canton-graph-view.component.scss']
})
export class CantonGraphViewComponent implements OnInit, OnDestroy {

  readonly aspectMapping: { [id: number]: { x: number, y: number } } = {
    0: {x: 622, y: 1551},
    1: {x: 1931, y: 1434},
    2: {x: 1298, y: 937},
    3: {x: 1928, y: 538},
    4: {x: 2438, y: 228},
    5: {x: 1298, y: 1434},
    6: {x: 1298, y: 1168},
    7: {x: 175, y: 698},
    8: {x: 1309, y: 53},
    9: {x: 625, y: 228},
    10: {x: 1928, y: 228},
    11: {x: 2438, y: 538},
    12: {x: 1929, y: 779},
    13: {x: 622, y: 1168},
    14: {x: 625, y: 933},
  };

  aspects: Aspect[];
  answerStack: AnswerStack;
  answerData: {
    [aspectId: number]: BehaviorSubject<Summary>,
  } = {};

  @Output() selectAspectEvent = new EventEmitter<number>();

  private subscriptions: Subscription[] = [];

  constructor(
    private questionnaireState: QuestionnaireState,
    private answerState: AnswerState,
  ) {
  }

  ngOnInit(): void {
    this.subscriptions.push(this.questionnaireState.getQuestionnaire$().subscribe(questionnaire =>
      this.aspects = questionnaire.aspects.filter(aspect => !!this.aspectMapping[aspect.id])
    ));
    this.subscriptions.push(this.answerState.getAnswers$().subscribe(answers => {
      this.answerStack = answers;

      // load all answers from all available aspects
      for (const [key, _] of Object.entries(this.aspectMapping)) {
        const aspectId: number = +key;
        if (!(aspectId in this.answerData)) {
          this.answerData[aspectId] = new BehaviorSubject<Summary>([0, 0, 0, 0, 0, 0]);
        }

        this.answerData[aspectId].next(this.getSummary(aspectId));
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getSummary(aspectId: number): Summary {
    return CalculationHelper.calculateAspectSummary(this.answerStack[aspectId]);
  }

  getData(aspectId: number): Observable<number[]> {
    return this.answerData[aspectId].asObservable();
  }

  onAspectClick(aspect: Aspect) {
    if (!this.isClickable(aspect)) {
      return;
    }
    this.selectAspectEvent.emit(aspect.id);
  }

  isClickable(aspect: Aspect): boolean {
    return (aspect.description !== null && aspect.description !== '') ||
      aspect.questions.length > 0;
  }
}
