import {Link} from './link';

export interface Help {
  help: string;
  severity: number;
  links?: Link[];
}
