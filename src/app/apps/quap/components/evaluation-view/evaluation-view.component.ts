import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Aspect} from '../../models/aspect';
import {AnswerOption, AnswerStack} from '../../models/question';
import {PopupService, PopupType} from '../../../../shared/services/popup.service';
import {DialogController, DialogService} from '../../../../shared/services/dialog.service';
import {AnswerState} from '../../state/answer.state';
import {QuapService} from '../../services/quap.service';
import {GroupFacade} from '../../../../store/facade/group.facade';
import {FilterFacade} from '../../../../store/facade/filter.facade';

@Component({
  selector: 'app-evaluation-view',
  templateUrl: './evaluation-view.component.html',
  styleUrls: ['./evaluation-view.component.scss']
})
export class EvaluationViewComponent implements OnInit, AfterViewInit, DialogController {
  @ViewChild('questionContainer', { static: false }) questionContainer: ElementRef;

  @Input() aspects: Aspect[];
  @Input() answers: AnswerStack;
  @Input() origin: string|null;
  @Input() disabled: boolean;

  localAnswers: AnswerStack;
  computedAnswers: AnswerStack;
  offset = 0;
  dataWasModified = false;

  constructor(
    private dialogService: DialogService,
    private popupService: PopupService,
    private quapService: QuapService,
    private groupFacade: GroupFacade,
    private filterFacade: FilterFacade,
    private answerState: AnswerState,
  ) { }

  ngOnInit(): void {
    this.dialogService.addDialogController(this);

    // clone the answers object without the references
    this.localAnswers = JSON.parse(JSON.stringify(this.answers));
    this.computedAnswers = this.answerState.getComputedAnswers();

    this.disabled = this.disabled || !this.filterFacade.isTodaySelected();
  }

  ngAfterViewInit(): void {
    this.offset = this.calculateOffset();
  }

  getCurrentAnswer(aspectId: number, questionId: number): AnswerOption {
    if (this.localAnswers[aspectId] === undefined || this.localAnswers[aspectId] === null) {
      this.localAnswers[aspectId] = {};
      return AnswerOption.NOT_ANSWERED;
    }

    if (this.localAnswers[aspectId][questionId] === undefined || this.localAnswers[aspectId][questionId] === null) {
      return AnswerOption.NOT_ANSWERED;
    }

    return this.localAnswers[aspectId][questionId];
  }

  getComputedAnswer(aspectId: number, questionId: number): AnswerOption {
    if (this.computedAnswers[aspectId] === undefined || this.computedAnswers[aspectId][questionId] === undefined) {
      return AnswerOption.NOT_ANSWERED;
    }

    return this.computedAnswers[aspectId][questionId];
  }

  submitAnswer(aspectId: number, questionId: number, answer: AnswerOption): void {
    this.dataWasModified = true;
    this.localAnswers[aspectId][questionId] = answer;
  }

  close(): void {
    let result = null;
    if (this.origin) {
      result = { returnTo: this.origin };
    }

    this.dialogService.close(result).then();
  }

  save(): void {
    if (this.disabled || !this.dataWasModified) {
      this.close();
      return;
    }

    this.dialogService.setLoading(true);

    const group = this.groupFacade.getCurrentGroupSnapshot();
    this.dataWasModified = false;
    /**
     * Not for anyone who works on something involving closing.
     * This does not really close the dialog. In all other ways of closing the dialog service is deleted, only when you save doese it appear again.
     * Beware this can cause unexpected behaviour when working with onClose().
     */
    this.quapService.submitAnswers(group.id, this.localAnswers).then((result) => {
      this.dialogService.setLoading(false);
      this.answerState.setAnswers(result);
      this.close();
    });
  }

  calculateOffset(): number {
    if (this.questionContainer.nativeElement.children.length === 0) {
      return 0;
    }
    // 10 is padding of parent
    return 0;
  }

  onCloseRequest(): Promise<boolean> {
    if (this.disabled || JSON.stringify(this.answers) === JSON.stringify(this.localAnswers) || !this.dataWasModified) {
      return Promise.resolve(true);
    }

    return this.popupService.open({
      title: 'dialog.quap.unsaved_changes.title',
      message: 'dialog.quap.unsaved_changes.message',
      cancel: 'dialog.quap.unsaved_changes.cancel',
      submit: 'dialog.quap.unsaved_changes.submit',
      type: PopupType.WARNING,
    })
  }

  beforeClosed(result: any): void {}

  afterClosed(result: any): void {}
}
