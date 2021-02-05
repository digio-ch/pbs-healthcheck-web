export function getTotalCount(isRange: boolean, chartData: any, tooltipModel: any): number {
  let total = 0;
  if (!isRange) {
    for (let item of chartData) {
      total += parseInt(item.value, 10);
    }
    return total;
  }
  for (let item of tooltipModel) {
    total += item.value;
  }
  return total;
}
