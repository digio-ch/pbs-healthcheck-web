import {Component, Input, OnInit} from '@angular/core';
import {DialogService} from '../../../../../../shared/services/dialog.service';
import {Aspect} from '../../models/aspect';
import {AnswerStack, Question} from '../../models/question';
import {Help} from "../../models/help";
import has = Reflect.has;

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent implements OnInit {

  @Input() aspects: Aspect[];
  @Input() answers: AnswerStack;

  aspectHelp: {
    [aspectId: number]: {
      help: {
        help: string;
        severity: number;
        answer: number;
        questionId: number;
      }[];
    }
  };

  private static convertSeverity(severity: number): string {
    switch (severity) {
      case 2: return 'yellow';
      case 3: return 'orange';
      case 4: return 'red';
      default: return 'red';
    }
  }

  constructor(
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.aspectHelp = {};

    this.aspects.forEach(aspect => {
      const aspectHelp = {
        help: [],
      };

      aspect.questions.forEach(question => {
        const help = this.getHelp(aspect.id, question);
        if (!help) {
          return;
        }

        const answer = this.getAnswer(aspect.id, question.id);

        aspectHelp.help.push({
          ...help,
          answer,
          questionId: question.id,
        });
      });

      aspectHelp.help = aspectHelp.help.sort(
        (a: any, b: any) => a.answer === b.answer ? 0 : a.answer > b.answer ? -1 : 1
      );

      this.aspectHelp[aspect.id] = aspectHelp;
    });
  }

  hasHelp(): boolean {
    let hasHelp = false;

    this.aspects.forEach(aspect => {
      if (this.aspectHelp[aspect.id].help.length > 0) {
        hasHelp = this.aspectHelp[aspect.id].help.filter(help => help.answer !== 1).length > 0;
      }
    });

    return hasHelp;
  }

  getHelp(aspectId: number, question: Question): Help {
    const answer = this.getAnswer(aspectId, question.id);

    if (answer === 0) {
      return null;
    }

    const help = question.help.filter(h => h.severity === answer || h.severity === 1).sort((a, b) => a.severity < b.severity ? 1 : -1);

    if (help.length > 0) {
      return help[0];
    }

    return null;
  }

  getColor(aspectId: number, questionId: number, severity: number): string {
    if (severity !== 1) {
      return DetailViewComponent.convertSeverity(severity);
    }

    const answer = this.getAnswer(aspectId, questionId);

    return DetailViewComponent.convertSeverity(answer);
  }

  private getAnswer(aspectId: number, questionId: number): number {
    if (this.answers[aspectId] === undefined || this.answers[aspectId][questionId] === undefined) {
      return 0;
    }

    return this.answers[aspectId][questionId];
  }

  close(): void {
    this.dialogService.close();
  }

  switchToEvaluationView(): void {
    this.dialogService.close({ switchTab: true });
  }
}
