import {SubdepartmentAnswer} from '../models/subdepartment-answer';
import {BehaviorSubject, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubdepartmentAnswerState {
  answers = new BehaviorSubject<SubdepartmentAnswer[]>([]);

  setAnswers(answers: SubdepartmentAnswer[]): void {
    this.answers.next(answers);
  }

  getAnswers$(): Observable<SubdepartmentAnswer[]> {
    return this.answers.asObservable();
  }

  getAnswersFromGroup$(groupId: number): Observable<SubdepartmentAnswer> {
    return this.getAnswers$().pipe(
      map(data => data.find(entity => entity.groupId === groupId))
    );
  }
}
