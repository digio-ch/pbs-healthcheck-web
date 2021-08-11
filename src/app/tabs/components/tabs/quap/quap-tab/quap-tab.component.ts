import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TabComponent} from "../../../tab/tab.component";
import {TabService} from "../../../../services/tab.service";
import {DialogService} from "../../../../../shared/services/dialog.service";
import {Questionnaire} from "../models/questionnaire";
import {AnswerStack, AnswerType} from "../models/question";

@Component({
  selector: 'app-quap-tab',
  templateUrl: './quap-tab.component.html',
  styleUrls: ['./quap-tab.component.scss']
})
export class QuapTabComponent extends TabComponent implements OnInit {
  public static TAB_CLASS_NAME = 'QuapTabComponent';

  @ViewChild('testDialog', { static: true }) testDialog: TemplateRef<any>;

  questionnaire: Questionnaire = {
    id: 1,
    aspects: [
      {
        id: 1,
        name: 'test aspect',
        questions: [
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
        ],
      },
      {
        id: 2,
        name: 'test aspect',
        questions: [
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
        ],
      },
    ],
  };

  answers: AnswerStack;

  constructor(
    protected tabService: TabService,
    private dialogService: DialogService,
  ) {
    super(tabService, QuapTabComponent);
  }

  ngOnInit(): void {
    this.answers = {};
  }

  openDialog(): void {
    this.dialogService.open(this.testDialog);
  }

  saveAnswers(answers: AnswerStack) {
    this.answers = answers;
  }

}
