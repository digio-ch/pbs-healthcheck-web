import {Component, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import {Aspect} from '../../../models/aspect';
import {CalculationHelper, Summary} from '../../../services/calculation.helper';
import {AnswerStack} from '../../../models/question';
import {QuestionnaireState} from '../../../store/questionnaire.state';
import {AnswerState} from '../../../store/answer.state';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-department-graph-view',
  templateUrl: './department-graph-view.component.html',
  styleUrls: ['./department-graph-view.component.scss']
})
export class DepartmentGraphViewComponent implements OnInit, OnDestroy {

  readonly aspectMapping: { [id: number]: { x: number, y: number } } = {
    // Programmattraktivität
    8: {x: 320, y: 320},
    // Erfüllung Mitgliederbedürfnisse
    9: {x: 960, y: 160},
    // Mitgliederzufriednheit
    10: {x: 1760, y: 160},
    // Image
    11: {x: 2240, y: 640},
    // Werbung
    5: {x: 1760, y: 800},
    // Ressourcen
    15: {x: 1760, y: 1280},
    // Mitgliederzahl
    12: {x: 2240, y: 960},
    // Austausch und Zusammenarbeit mit externen Partnern
    6: {x: 1120, y: 960},
    // Betreuungsnetzwerk
    2: {x: 1760, y: 1760},
    // Aus- und Weiterbildung
    0: {x: 1280, y: 1600},
    // Motivation Leitende
    14: {x: 320, y: 1600},
    // Auswertungskultur
    7: {x: 800, y: 1280},
    // Qualität im Leitungsteam
    13: {x: 320, y: 1280},
    // Stufengerechtes Programm
    3: {x: 480, y: 800},
    // Umsetzung Pfadiprofil
    4: {x: 160, y: 800},
    // Betreuung der Leitenden
    1: {x: 1280, y: 1920},
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
    this.subscriptions.push(this.questionnaireState.getQuestionnaire$().subscribe(questionnaire => this.aspects = questionnaire.aspects));
    this.subscriptions.push(this.answerState.getAnswers$().subscribe(answers => {
      this.answerStack = answers;

      for (const [key, _] of Object.entries(this.answerStack)) {
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

  onAspectClick(index: number) {
    if (this.aspects[index].questions.length < 1) {
      return;
    }
    this.selectAspectEvent.emit(index);
  }
}
