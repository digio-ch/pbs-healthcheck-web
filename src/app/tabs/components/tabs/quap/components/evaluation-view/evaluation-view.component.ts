import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {Aspect} from "../../models/aspect";
import {AnswerOption, AnswerStack} from "../../models/question";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PopupData, PopupService} from "../../../../../../shared/services/popup.service";
import {BehaviorSubject} from "rxjs";
import {DialogService} from "../../../../../../shared/services/dialog.service";
import {AnswerState} from '../../store/answer.state';

@Component({
  selector: 'app-evaluation-view',
  templateUrl: './evaluation-view.component.html',
  styleUrls: ['./evaluation-view.component.scss']
})
export class EvaluationViewComponent implements OnInit {
  @Input() aspects: Aspect[];
  @Input() answers: AnswerStack;

  constructor(
    private dialogService: DialogService,
    private popupService: PopupService,
    private answerState: AnswerState,
  ) { }

  ngOnInit(): void {
  }

  getCurrentAnswer(aspectId: number, questionId: number): AnswerOption { // TODO allow to set relevant on midata questions
    if (this.answers[aspectId] === undefined) {
      this.answers[aspectId] = {};
      return AnswerOption.NOT_ANSWERED;
    }

    if (this.answers[aspectId][questionId] === undefined) {
      return AnswerOption.NOT_ANSWERED;
    }

    return this.answers[aspectId][questionId];
  }

  submitAnswer(aspectId: number, questionId: number, answer: AnswerOption): void {
    this.answers[aspectId][questionId] = answer;
  }

  close(): void {
    this.popupService.open({
      title: 'dialog.quap.unsaved_changes.title',
      message: 'dialog.quap.unsaved_changes.message',
    }).then(result => {
      if (result) {
        this.dialogService.close();
      }
    });
  }

  save(): void {
    this.dialogService.setLoading(true);
    // TODO api request
    this.answerState.setAnswers(this.answers);
  }

}
