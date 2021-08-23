import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {Aspect} from "../../models/aspect";
import {AnswerOption, AnswerStack} from "../../models/question";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PopupData, PopupService} from "../../../../../../shared/services/popup.service";
import {BehaviorSubject} from "rxjs";
import {DialogService} from "../../../../../../shared/services/dialog.service";
import {AnswerState} from '../../store/answer.state';
import {QuapService} from '../../services/quap.service';
import {GroupFacade} from '../../../../../../store/facade/group.facade';

@Component({
  selector: 'app-evaluation-view',
  templateUrl: './evaluation-view.component.html',
  styleUrls: ['./evaluation-view.component.scss']
})
export class EvaluationViewComponent implements OnInit {
  @Input() aspects: Aspect[];
  @Input() answers: AnswerStack;

  localAnswers: AnswerStack;

  constructor(
    private dialogService: DialogService,
    private popupService: PopupService,
    private quapService: QuapService,
    private groupFacade: GroupFacade,
    private answerState: AnswerState,
  ) { }

  ngOnInit(): void {
    // clone the answers object without the references
    this.localAnswers = JSON.parse(JSON.stringify(this.answers));
  }

  getCurrentAnswer(aspectId: number, questionId: number): AnswerOption {
    if (this.localAnswers[aspectId] === undefined) {
      this.localAnswers[aspectId] = {};
      return AnswerOption.NOT_ANSWERED;
    }

    if (this.localAnswers[aspectId][questionId] === undefined) {
      return AnswerOption.NOT_ANSWERED;
    }

    return this.localAnswers[aspectId][questionId];
  }

  submitAnswer(aspectId: number, questionId: number, answer: AnswerOption): void {
    this.localAnswers[aspectId][questionId] = answer;
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

    const group = this.groupFacade.getCurrentGroupSnapshot();

    this.quapService.submitAnswers(group.id, this.localAnswers).subscribe(result => {
      this.dialogService.setLoading(false);
      this.answerState.setAnswers(result);
      this.dialogService.close();
    });
  }

}
