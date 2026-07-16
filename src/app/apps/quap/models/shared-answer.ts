import { AnswerStack } from './question';
import { Summary } from '../services/calculation.helper';

export interface SharedAnswer {
  groupId: number;
  groupName: string;
  groupTypeId: number;
  groupType: string;
  answers: AnswerStack;
  computedAnswers: AnswerStack;
  summary: Summary;
}

export interface HierachicalSharedAnswer {
  value: SharedAnswer | null
  children: HierachicalSharedAnswer[]
}