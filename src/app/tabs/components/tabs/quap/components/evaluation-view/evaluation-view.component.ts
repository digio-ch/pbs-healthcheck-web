import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Aspect} from "../../models/aspect";
import {AnswerOption, AnswerStack} from "../../models/question";

@Component({
  selector: 'app-evaluation-view',
  templateUrl: './evaluation-view.component.html',
  styleUrls: ['./evaluation-view.component.scss']
})
export class EvaluationViewComponent implements OnInit {
  @Input() aspects: Aspect[];
  @Input() answers: AnswerStack;
  @Output() saveAnswers = new EventEmitter<AnswerStack>();

  constructor() { }

  ngOnInit(): void {
  }

  getCurrentAnswer(aspectId: number, questionId: number): AnswerOption {
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

  save(): void {
    this.saveAnswers.emit(this.answers);
  }

}
