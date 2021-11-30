import {Component, ElementRef, Input, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Aspect} from '../../models/aspect';
import {AnswerOption, AnswerStack} from '../../models/question';
import {PopupService} from '../../../../../../shared/services/popup.service';
import {DialogController, DialogService} from '../../../../../../shared/services/dialog.service';
import {AnswerState} from '../../store/answer.state';
import {QuapService} from '../../services/quap.service';
import {GroupFacade} from '../../../../../../store/facade/group.facade';
import {FilterFacade} from '../../../../../../store/facade/filter.facade';

@Component({
  selector: 'app-evaluation-view',
  templateUrl: './evaluation-view.component.html',
  styleUrls: ['./evaluation-view.component.scss']
})
export class EvaluationViewComponent implements OnInit, AfterViewInit, DialogController {
  @ViewChild('questionContainer', { static: false }) questionContainer: ElementRef;

  @Input() aspects: Aspect[];
  @Input() answers: AnswerStack;

  localAnswers: AnswerStack;
  computedAnswers: AnswerStack;
  disabled: boolean;
  offset = 0;

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

    this.disabled = !this.filterFacade.isTodaySelected();
  }

  ngAfterViewInit(): void {
    this.offset = this.calculateOffset();
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

  getComputedAnswer(aspectId: number, questionId: number): AnswerOption {
    if (this.computedAnswers[aspectId] === undefined || this.computedAnswers[aspectId][questionId] === undefined) {
      return AnswerOption.NOT_ANSWERED;
    }

    return this.computedAnswers[aspectId][questionId];
  }

  submitAnswer(aspectId: number, questionId: number, answer: AnswerOption): void {
    this.localAnswers[aspectId][questionId] = answer;
  }

  close(): void {
    this.dialogService.close().then();
  }

  save(): void {
    if (this.disabled) {
      this.close();
      return;
    }

    this.dialogService.setLoading(true);

    const group = this.groupFacade.getCurrentGroupSnapshot();

    this.quapService.submitAnswers(group.id, this.localAnswers).subscribe(result => {
      this.dialogService.setLoading(false);
      this.answerState.setAnswers(result);
      this.dialogService.forceClose();
    });
  }

  calculateOffset(): number {
    if (this.questionContainer.nativeElement.children.length === 0) {
      return 0;
    }
    // 10 is padding of parent
    return this.questionContainer.nativeElement.offsetWidth - this.questionContainer.nativeElement.children[0].offsetWidth - 10;
  }

  onCloseRequest(): Promise<boolean> {
    if (this.disabled || JSON.stringify(this.answers) === JSON.stringify(this.localAnswers)) {
      return Promise.resolve(true);
    }

    return this.popupService.open({
      title: 'dialog.quap.unsaved_changes.title',
      message: 'dialog.quap.unsaved_changes.message',
    });
  }

  beforeClosed(result: any): void {}

  afterClosed(result: any): void {}
}
