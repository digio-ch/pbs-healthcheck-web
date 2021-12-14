import {Injectable} from '@angular/core';
import {Questionnaire} from '../models/questionnaire';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireState {

  private questionnaire = new BehaviorSubject<Questionnaire>(null);

  getQuestionnaire$(): Observable<Questionnaire> {
    return this.questionnaire.asObservable();
  }

  getQuestionnaire(): Questionnaire {
    return this.questionnaire.value;
  }

  setQuestionnaire(questionnaire: Questionnaire): void {
    this.questionnaire.next(questionnaire);
  }

}
