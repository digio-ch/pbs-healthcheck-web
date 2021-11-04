export function getTotalCount(isRange: boolean, chartData: any, tooltipModel: any): number {
  let total = 0;
  if (!isRange) {
    for (const item of chartData) {
      total += parseInt(item.value, 10);
    }
    return total;
  }
  for (const item of tooltipModel) {
    total += item.value;
  }
  return total;
}
