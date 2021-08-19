import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TabComponent} from "../../../tab/tab.component";
import {TabService} from "../../../../services/tab.service";
import {DialogService} from "../../../../../shared/services/dialog.service";
import {Questionnaire} from "../models/questionnaire";
import {AnswerOption, AnswerStack, AnswerType} from "../models/question";
import {PopupService} from "../../../../../shared/services/popup.service";
import {BehaviorSubject} from "rxjs";
import {AnswerState} from '../store/answer.state';
import {QuestionnaireState} from '../store/questionnaire.state';
import {QuapService} from '../services/quap.service';

@Component({
  selector: 'app-quap-tab',
  templateUrl: './quap-tab.component.html',
  styleUrls: ['./quap-tab.component.scss']
})
export class QuapTabComponent extends TabComponent implements OnInit {
  public static TAB_CLASS_NAME = 'QuapTabComponent';

  @ViewChild('evaluationView', { static: true }) evaluationView: TemplateRef<any>;

  questionnaire: Questionnaire;
  answers: AnswerStack;

  constructor(
    protected tabService: TabService,
    private dialogService: DialogService,
    private popupService: PopupService,
    private quapService: QuapService,
    private questionnaireState: QuestionnaireState,
    private answerState: AnswerState,
  ) {
    super(tabService, QuapTabComponent);
  }

  ngOnInit(): void {
    this.questionnaireState.getQuestionnaire$().subscribe(questionnaire => this.questionnaire = questionnaire);
    this.answerState.getAnswers$().subscribe(answers => this.answers = answers);

    // TODO example data replace with real data
    this.questionnaireState.setQuestionnaire({
      id: 1,
      aspects: [
        {id: 1, name: 'Programm', questions: []},
        {id: 2, name: 'Erfüllung', questions: []},
        {id: 3, name: 'Zufriedenheit', questions: []},
        {id: 4, name: 'Image', questions: []},
        {id: 5, name: 'Werbung', questions: [
            {
              id: 1,
              question: 'is this a test?',
              answerOptions: AnswerType.BINARY,
            },
            {
              id: 2,
              question: 'is this a test?',
              answerOptions: AnswerType.MIDATA, // TODO allow to set relevant
            },
            {
              id: 3,
              question: 'is this a test?',
              answerOptions: AnswerType.RANGE,
            },
            {
              id: 4,
              question: 'is this a test?',
              answerOptions: AnswerType.RANGE,
            },
          ]},
        {id: 6, name: 'Ressourcen', questions: []},
        {id: 7, name: 'Zahl', questions: []},
        {id: 8, name: 'Ausstausch', questions: []},
        {id: 9, name: 'Netzwerk', questions: []},
        {id: 10, name: 'Bildung', questions: []},
        {id: 11, name: 'Motivation', questions: []},
        {id: 12, name: 'Kultur', questions: [
            {
              id: 1,
              question: 'is this a test?',
              answerOptions: AnswerType.BINARY,
            },
            {
              id: 2,
              question: 'is this a test?',
              answerOptions: AnswerType.MIDATA,
            },
            {
              id: 3,
              question: 'is this a test?',
              answerOptions: AnswerType.RANGE,
            },
            {
              id: 4,
              question: 'is this a test?',
              answerOptions: AnswerType.RANGE,
            },
          ]},
        {id: 13, name: 'Team', questions: []},
        {id: 14, name: 'Programm', questions: []},
        {id: 15, name: 'Profil', questions: []},
        {id: 16, name: 'Betreuung', questions: []},
      ]
    });

    // TODO example data replace with real data
    this.answerState.setAnswers({
      1: {
        1: AnswerOption.FULLY_APPLIES,
        2: AnswerOption.FULLY_APPLIES,
        3: AnswerOption.NOT_ANSWERED,
        4: AnswerOption.SOMEWHAT_APPLIES,
        5: AnswerOption.NOT_RELEVANT,
      }
    });
  }

  loadData(): Promise<any> {
    const questionnairePromise = this.quapService.getQuestionnaire().toPromise();

    return Promise.all([questionnairePromise]).then(values => {
      console.log(values);

      return values;
    });
  }

  openEvaluationDialog(): void {
    const dialogSubscription = this.dialogService.open(this.evaluationView, { disableClose: true });

    dialogSubscription.onCloseRequest(() => {
      return this.popupService.open({
        title: 'dialog.quap.unsaved_changes.title',
        message: 'dialog.quap.unsaved_changes.message',
      }).then(result => {
        return result;
      });
    });
  }

}
