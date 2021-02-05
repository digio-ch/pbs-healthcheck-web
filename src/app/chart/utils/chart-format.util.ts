import * as moment from 'moment';

export function transformLineChartDate(chartData: any): any {
  chartData.forEach(item => {
    item.series.forEach(series => {
      series.name = moment(series.name, 'DD.MM.YYYY').toDate();
    });
  });
}

// TODO: not supported for bar-vertical-stacked chart
// export function transformStackedBarChartDate(chartData: any): any {
//   chartData.forEach(item => {
//     item.name = moment(item.name, 'DD.MM.YYYY').toDate();
//   });
// }

export function formatTickToWholeNumber(value) {
  return (value % 1 === 0) ? value.toLocaleString() : '';
}

export function formatTickDate(value, momentFormat = 'MMM YYYY') {
  return moment(value).format(momentFormat);
}
