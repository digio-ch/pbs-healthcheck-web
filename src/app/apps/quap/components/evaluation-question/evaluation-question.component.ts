import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AnswerOption, AnswerType, Question} from '../../models/question';

@Component({
  selector: 'app-evaluation-question',
  templateUrl: './evaluation-question.component.html',
  styleUrls: ['./evaluation-question.component.scss']
})
export class EvaluationQuestionComponent implements OnInit {
  @Input() question: Question;
  @Input() currentAnswer: AnswerOption;
  @Input() computedAnswer: AnswerOption = AnswerOption.NOT_ANSWERED;
  @Input() isDisabled: boolean;
  @Output() answer = new EventEmitter<number>();

  answerOptions = [
    {
      tag: 'fully_applies',
      option: AnswerOption.FULLY_APPLIES,
    },
    {
      tag: 'partially_applies',
      option: AnswerOption.PARTIALLY_APPLIES,
    },
    {
      tag: 'somewhat_applies',
      option: AnswerOption.SOMEWHAT_APPLIES,
    },
    {
      tag: 'dont_applies',
      option: AnswerOption.DONT_APPLIES,
    },
    {
      tag: 'not_relevant',
      option: AnswerOption.NOT_RELEVANT,
    },
  ];

  constructor() {
  }

  ngOnInit(): void {
    if (this.currentAnswer === undefined || this.currentAnswer === null) {
      this.currentAnswer = AnswerOption.NOT_ANSWERED;
    }
  }

  change(event: Event, value: AnswerOption) {
    const target = (event.target as HTMLInputElement);
    if (this.currentAnswer !== value) {
      // value changed
      target.checked = true;
    } else {
      // unselect value
      target.checked = false;
      if (this.isMidataQuestion()) {
        // reselect computed answer
        value = this.computedAnswer;
      } else {
        value = AnswerOption.NOT_ANSWERED;
      }
    }

    this.currentAnswer = value;
    this.answer.emit(value);
  }

  isComputed(): boolean {
    return [
      AnswerType.MIDATA,
      AnswerType.MIDATA_BINARY,
      AnswerType.MIDATA_RANGE,
    ].includes(this.question.answerOptions as AnswerType);
  }

  allowsAnswerOption(answerOption: AnswerOption): boolean {
    switch (this.question.answerOptions) {
      case AnswerType.MIDATA:
        return answerOption === AnswerOption.NOT_RELEVANT;
      case AnswerType.BINARY:
      case AnswerType.MIDATA_BINARY:
        return answerOption === AnswerOption.FULLY_APPLIES ||
            answerOption === AnswerOption.DONT_APPLIES ||
            answerOption === AnswerOption.NOT_RELEVANT;
      default:
        return true;
    }
  }

  disabled(answerOption: AnswerOption): boolean {
    if (this.isDisabled) {
      return true;
    }

    switch (this.question.answerOptions) {
      case AnswerType.MIDATA:
      case AnswerType.MIDATA_BINARY:
      case AnswerType.MIDATA_RANGE:
        return answerOption !== AnswerOption.NOT_RELEVANT;
      default:
        return false;
    }
  }

  private isMidataQuestion(): boolean {
    return this.question.answerOptions === AnswerType.MIDATA_BINARY ||
      this.question.answerOptions === AnswerType.MIDATA_RANGE;
  }

}
