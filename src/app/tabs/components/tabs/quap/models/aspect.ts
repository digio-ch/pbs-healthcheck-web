import {Question} from "./question";

export interface Aspect {
  id: number;
  name: string;
  questions: Question[];
}
