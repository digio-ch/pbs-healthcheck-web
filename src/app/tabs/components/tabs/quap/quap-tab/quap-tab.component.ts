import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TabComponent} from "../../../tab/tab.component";
import {TabService} from "../../../../services/tab.service";
import {DialogService} from "../../../../../shared/services/dialog.service";
import {Questionnaire} from "../models/questionnaire";
import {AnswerStack, AnswerType} from "../models/question";
import {PopupService} from "../../../../../shared/services/popup.service";
import {BehaviorSubject} from "rxjs";

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
    private popupService: PopupService,
  ) {
    super(tabService, QuapTabComponent);
  }

  ngOnInit(): void {
    this.answers = {};
  }

  openDialog(): void {
    const dialogSubscription = this.dialogService.open(this.testDialog, { disableClose: true });

    dialogSubscription.onCloseRequest(() => {
      return this.popupService.open({
        title: 'dialog.quap.unsaved_changes.title',
        message: 'dialog.quap.unsaved_changes.message',
      }).then(result => {
        return result;
      });
    });
  }

  saveAnswers(answers: AnswerStack) {
    this.answers = answers;
  }

}
