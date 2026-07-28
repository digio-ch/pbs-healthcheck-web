import { GroupType } from 'src/app/shared/models/group-type';
import { Aspect } from './aspect';

export const QUESTIONNAIRE_TYPE_DEFAULT = 'Questionnaire::Group::Default' as const;
export const QUESTIONNAIRE_TYPE_CANTON = 'Questionnaire::Group::Canton' as const;

export type QuestionnaireType = 
  | typeof QUESTIONNAIRE_TYPE_DEFAULT
  | typeof QUESTIONNAIRE_TYPE_CANTON;

export interface Questionnaire {
  id: number;
  type: QuestionnaireType;
  aspects: Aspect[];
}

export function groupTypeToQuestionnaireType(groupType: string): QuestionnaireType {
  switch(groupType) {
    case GroupType.DEPARTMENT_KEY:
      return QUESTIONNAIRE_TYPE_DEFAULT;
    case GroupType.REGIONAL_KEY:
    case GroupType.CANTONAL_KEY:
      return QUESTIONNAIRE_TYPE_CANTON;
    default:
      throw new Error(`group type ${groupType} has no questionnaire type`);
  }
}