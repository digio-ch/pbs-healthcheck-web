import {DateSelection} from './date-selection';

export class DateQuickSelectionOption {
  constructor(
    public available: boolean,
    public dateSelection: DateSelection,
    public label: string
  ) {
  }
}
