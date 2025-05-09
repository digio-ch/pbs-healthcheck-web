import {Component, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import {Aspect} from '../../../models/aspect';
import {CalculationHelper, Summary} from '../../../services/calculation.helper';
import {AnswerStack} from '../../../models/question';
import {QuestionnaireState} from '../../../state/questionnaire.state';
import {AnswerState} from '../../../state/answer.state';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-department-graph-view',
  templateUrl: './department-graph-view.component.html',
  styleUrls: ['./department-graph-view.component.scss']
})
export class DepartmentGraphViewComponent implements OnInit, OnDestroy {

  readonly aspectMapping: { [id: number]: { x: number, y: number } } = {
    // Programmattraktivität
    8: {x: 264, y: 240},
    // Erfüllung Mitgliederbedürfnisse
    9: {x: 1064, y: 80},
    // Mitgliederzufriednheit
    10: {x: 2024, y: 80},
    // Image
    11: {x: 2504, y: 400},
    // Werbung
    5: {x: 2024, y: 560},
    // Ressourcen
    15: {x: 2024, y: 1040},
    // Mitgliederzahl
    12: {x: 2504, y: 720},
    // Austausch und Zusammenarbeit mit externen Partnern
    6: {x: 1384, y: 800},
    // Betreuungsnetzwerk
    2: {x: 2024, y: 1520},
    // Aus- und Weiterbildung
    0: {x: 1384, y: 1200},
    // Motivation Leitende
    14: {x: 264, y: 1360},
    // Auswertungskultur
    7: {x: 744, y: 1040},
    // Qualität im Leitungsteam
    13: {x: 264, y: 1040},
    // Stufengerechtes Programm
    3: {x: 440, y: 600},
    // Umsetzung Pfadiprofil
    4: {x: 80, y: 600},
    // Betreuung der Leitenden
    1: {x: 1384, y: 1520},
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
