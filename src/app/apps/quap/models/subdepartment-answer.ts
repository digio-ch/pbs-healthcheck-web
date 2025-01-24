import {AnswerStack} from './question';
import {Summary} from '../services/calculation.helper';

export interface SubDepartmentAnswer {
  groupId: number;
  groupName: string;
  groupTypeId: number;
  groupType: string;
  answers: AnswerStack;
  computedAnswers: AnswerStack;
  summary: Summary;
}

export interface HierachicalSubDepartmentAnswer {
  parent: SubDepartmentAnswer | null
  children: HierachicalSubDepartmentAnswer[]
}