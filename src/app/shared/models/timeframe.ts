import { DateSelection } from "./date-selection/date-selection";

/**
 * Represents either a single date or a period with from and to dates \
 * Unwrap by checking for the isRange bool
 */
export type TimeFrame = 
  | {
    isRange: true;
    from: moment.Moment;
    to: moment.Moment;
  }
  | {
    isRange: false;
    date: moment.Moment;
};

export function TimeFrameFromDate(date: moment.Moment): TimeFrame {
  return {
    isRange: false,
    date: date,
  }
};

export function TimeFrameFromPeriod(from: moment.Moment, to: moment.Moment): TimeFrame {
  return {
    isRange: true,
    from: from,
    to: to,
  }
};

export function TimeFrameFromDateSelection(dateSelection: DateSelection): TimeFrame {
  if(!dateSelection.isRange) {
    return {
      isRange: false,
      date: dateSelection.startDate,
    }
  }

  return {
    isRange: true,
    from: dateSelection.startDate,
    to: dateSelection.endDate,
  }
}