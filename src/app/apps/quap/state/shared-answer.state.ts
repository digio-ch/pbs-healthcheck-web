import { HierachicalSharedAnswer, SharedAnswer } from '../models/shared-answer';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SharedAnswerState {
  answers = new BehaviorSubject<HierachicalSharedAnswer[]>([]);

  setAnswers(answers: HierachicalSharedAnswer[]): void {
    this.answers.next(answers);
  }

  getAnswers$(): Observable<HierachicalSharedAnswer[]> {
    return this.answers.asObservable();
  }

  getAnswersFromGroup$(groupId: number): Observable<SharedAnswer> {
    return this.getAnswers$().pipe(
      map(data => {
        for (const element of data) {
          const match = this.getAnswersFromGroup(element, groupId)
          if (match !== undefined) {
            return match
          }
        }
      })
    );
  }

  getAnswersFromGroup(nested: HierachicalSharedAnswer, groupId: number): SharedAnswer {
    if (nested.value && nested.value.groupId === groupId) {
      return nested.value;
    }

    for (const child of nested.children) {
      const match = this.getAnswersFromGroup(child, groupId)
      if (match !== undefined) {
        return match
      }
    }
  }
}
