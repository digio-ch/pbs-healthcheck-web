import {HierachicalSubDepartmentAnswer, SubDepartmentAnswer} from '../models/subdepartment-answer';
import {BehaviorSubject, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubdepartmentAnswerState {
  answers = new BehaviorSubject<HierachicalSubDepartmentAnswer[]>([]);

  setAnswers(answers: HierachicalSubDepartmentAnswer[]): void {
    this.answers.next(answers);
  }

  getAnswers$(): Observable<HierachicalSubDepartmentAnswer[]> {
    return this.answers.asObservable();
  }

  getAnswersFromGroup$(groupId: number): Observable<SubDepartmentAnswer> {
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

  getAnswersFromGroup(nested: HierachicalSubDepartmentAnswer, groupId: number): SubDepartmentAnswer {
    if (nested.parent.groupId === groupId) {
      return nested.parent;
    }

    for (const child of nested.children) {
      const match = this.getAnswersFromGroup(child, groupId)
      if (match !== undefined) {
        return match
      }
    }
  }
}
