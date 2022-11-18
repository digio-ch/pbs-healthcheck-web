import {Question} from './question';

export interface Aspect {
  id: number;
  name: string;
  description: string;
  questions: Question[];
}
