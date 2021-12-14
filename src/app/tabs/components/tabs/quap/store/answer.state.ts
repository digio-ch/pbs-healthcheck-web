import {Injectable} from '@angular/core';
import {AnswerStack, AspectAnswerStack} from '../models/question';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnswerState {

  private answers = new BehaviorSubject<AnswerStack>(null);
  private computedAnswers = new BehaviorSubject<AnswerStack>(null);

  getAnswers$(): Observable<AnswerStack> {
    return this.answers.asObservable();
  }

  getAnswers(): AnswerStack {
    return this.answers.value;
  }

  setAnswers(answers: AnswerStack): void {
    this.answers.next(answers);
  }

  getComputedAnswers$(): Observable<AnswerStack> {
    return this.computedAnswers.asObservable();
  }

  getComputedAnswers(): AnswerStack {
    return this.computedAnswers.value;
  }

  setComputedAnswers(computedAnswers: AnswerStack): void {
    this.computedAnswers.next(computedAnswers);
  }

}
