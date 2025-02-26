import {AnswerStack} from './question';
import {Summary} from '../services/calculation.helper';

export interface SubdepartmentAnswer {
  groupId: number;
  groupName: string;
  groupTypeId: number;
  groupType: string;
  answers: AnswerStack;
  computedAnswers: AnswerStack;
  summary: Summary;
}
