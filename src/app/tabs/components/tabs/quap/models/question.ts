import {Help} from './help';

export interface Question {
  id: number;
  question: string;
  answerOptions: string;
  help: Help[];
}

export enum AnswerType {
  RANGE = 'range',
  BINARY = 'binary',
  MIDATA = 'midata',
  MIDATA_RANGE = 'midata-range',
  MIDATA_BINARY = 'midata-binary',
}

export enum AnswerOption {
  NOT_ANSWERED,
  FULLY_APPLIES,
  PARTIALLY_APPLIES,
  SOMEWHAT_APPLIES,
  DONT_APPLIES,
  NOT_RELEVANT,
}

export interface AspectAnswerStack {
  [id: number]: AnswerOption;
}

export interface AnswerStack {
  [id: number]: AspectAnswerStack;
}
