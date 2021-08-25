import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {Aspect} from '../../../models/aspect';
import {CalculationHelper} from '../../../services/calculation.helper';
import {AnswerStack} from '../../../models/question';
import {QuestionnaireState} from '../../../store/questionnaire.state';
import {AnswerState} from '../../../store/answer.state';

@Component({
  selector: 'app-department-graph-view',
  templateUrl: './department-graph-view.component.html',
  styleUrls: ['./department-graph-view.component.scss']
})
export class DepartmentGraphViewComponent implements OnInit {

  aspectMapping: { [id: number]: { x: number, y: number } } = {
    // Programmattraktivität
    1: {x: 320, y: 320},
    // Erfüllung Mitgliederbedürfnisse
    2: {x: 960, y: 160},
    // Mitgliederzufriednheit
    3: {x: 1760, y: 160},
    // Image
    4: {x: 2240, y: 640},
    // Werbung
    5: {x: 1760, y: 800},
    // Ressourcen
    6: {x: 1760, y: 1280},
    // Mitgliederzahl
    7: {x: 2240, y: 960},
    // Austausch und Zusammenarbeit mit externen Partnern
    8: {x: 1120, y: 960},
    // Betreuungsnetzwerk
    9: {x: 1760, y: 1760},
    // Aus- und Weiterbildung
    10: {x: 1280, y: 1600},
    // Motivation Leitende
    11: {x: 320, y: 1600},
    // Auswertungskultur
    12: {x: 800, y: 1280},
    // Qualität im Leitungsteam
    13: {x: 320, y: 1280},
    // Stufengerechtes Programm
    14: {x: 480, y: 800},
    // Umsetzung Pfadiprofil
    15: {x: 160, y: 800},
    // Betreuung der Leitenden
    16: {x: 1280, y: 1920},
  };

  aspects: Aspect[];
  answerStack: AnswerStack;

  @Output() selectAspectEvent = new EventEmitter<number>();

  constructor(
    private questionnaireState: QuestionnaireState,
    private answerState: AnswerState,
  ) {
  }

  ngOnInit(): void {
    this.questionnaireState.getQuestionnaire$().subscribe(questionnaire => this.aspects = questionnaire.aspects);
    this.answerState.getAnswers$().subscribe(answers => this.answerStack = answers);
  }

  getSummary(aspectId: number): number[] {
    return CalculationHelper.calculateAspectSummary(this.answerStack[aspectId]);
  }

  onAspectClick(index: number) {
    if (this.aspects[index].questions.length < 1) {
      return;
    }
    this.selectAspectEvent.emit(index);
  }
}
