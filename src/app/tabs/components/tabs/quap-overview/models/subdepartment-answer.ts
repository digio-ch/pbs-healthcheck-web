import {AnswerStack} from '../../quap/models/question';
import {Summary} from '../../quap/services/calculation.helper';

export interface SubdepartmentAnswer {
  groupId: number;
  groupName: string;
  groupTypeId: number;
  groupType: string;
  answers: AnswerStack;
  computedAnswers: AnswerStack;
  summary: Summary;
}
