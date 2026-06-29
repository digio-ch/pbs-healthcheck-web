import moment from 'moment';
import { DateSelection } from 'src/app/shared/models/date-selection/date-selection';
import { DateModel } from 'src/app/shared/models/date-selection/date.model';

/**
 * fill in the missing dates and return the dates as Date
 */
export function fillInMissingDates(
  chartData: any[],
  selection: DateSelection,
  availableDates: DateModel[]
): any[] {

  const axis = availableDates
    .filter(date => 
      date.date.isSameOrAfter(selection.startDate) && 
      date.date.isSameOrBefore(selection.endDate)
    )
    .map(date => formatTickDate(date.date, "DD.MM.YYYY"))
    .reverse();

  return chartData.map(item => {
    const valueMap = new Map<string, number>();

    for (const point of item.series) {
      valueMap.set(
        point.name,
        point.value
      );
    }

    const filledSeries = axis.map(date => ({
      name: moment(date, "DD.MM.YYYY").toDate(),
      value: valueMap.get(date) ?? 0
    }));

    return {
      ...item,
      series: filledSeries
    };
  });
}

export function isEmptyLineChart(chartData: any[], isRange: boolean) {
    if (!isRange) {
      return chartData.every(item => item.value === "0");
    }
    
    return chartData.every(item => item.series.length === 0);
}

export function formatTickToWholeNumber(value) {
  return (value % 1 === 0) ? value.toLocaleString() : '';
}

export function formatTickDate(value, momentFormat = 'MMM YYYY') {
  return moment(value).format(momentFormat);
}
