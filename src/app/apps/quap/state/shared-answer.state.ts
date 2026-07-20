import { HierachicalSharedAnswer, SharedAnswer } from '../models/shared-answer';
import { BehaviorSubject, Observable } from 'rxjs';
import { inject, Injectable, signal } from '@angular/core';
import { finalize, first, map, tap } from 'rxjs/operators';
import { QuapService } from '../services/quap.service';
import { DateSelection } from 'src/app/shared/models/date-selection/date-selection';
import { CalculationHelper } from '../services/calculation.helper';

@Injectable({
  providedIn: 'root'
})
export class SharedAnswerState {
  private quapService = inject(QuapService);

  private answers = new BehaviorSubject<HierachicalSharedAnswer[]>([]);
  readonly isLoading = signal(true);

  loadAnswers(groupId: number, dateSelection: DateSelection): Observable<any> {
    this.isLoading.set(true);
    return this.quapService.getSharedAnswers(dateSelection, groupId).pipe(
      first(),
      map(data => data.map(entry => this.withSummary(entry))),
      tap(data => this.answers.next(data)),
      finalize(() => this.isLoading.set(false)),
    );
  }

  getAnswers$(): Observable<HierachicalSharedAnswer[]> {
    return this.answers.asObservable();
  }

  getAnswersFromGroup$(groupId: number): Observable<SharedAnswer | null> {
    return this.getAnswers$().pipe(
      map(data => {
        for (const element of data) {
          const match = this.getAnswersFromGroup(element, groupId);
          if (match !== null) {
            return match;
          }
        }

        return null;
      })
    );
  }

  private getAnswersFromGroup(nested: HierachicalSharedAnswer, groupId: number): SharedAnswer | null {
    if (nested.value && nested.value.groupId === groupId) {
      return nested.value;
    }

    for (const child of nested.children) {
      const match = this.getAnswersFromGroup(child, groupId)
      if (match !== null) {
        return match;
      }
    }

    return null;
  }

  /**
   * Adds summary for the preview of a questionnaire
   */
  private withSummary(hierarchicalAnswer: HierachicalSharedAnswer): HierachicalSharedAnswer {
    const sharedAnswer = hierarchicalAnswer.value;

    if (sharedAnswer !== null) {
      hierarchicalAnswer.value.summary = CalculationHelper.calculateSummary(
        CalculationHelper.combineAnswerStacks(sharedAnswer.answers, sharedAnswer.computedAnswers),
        true,
      )
    }

    if (hierarchicalAnswer.children.length > 0) {
      hierarchicalAnswer.children = hierarchicalAnswer.children.map(h => this.withSummary(h))
    }

    return hierarchicalAnswer;
  }
}
