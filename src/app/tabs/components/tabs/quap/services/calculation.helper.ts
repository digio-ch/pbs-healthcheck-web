import {AnswerStack, AspectAnswerStack} from "../models/question";

export class CalculationHelper {

  public static calculateSummary(data: AnswerStack, inPercentage: boolean): number[] {
    if (data === undefined) {
      return inPercentage ? [100, 0, 0, 0, 0] : [0, 0, 0, 0, 0];
    }

    let summary = [0, 0, 0, 0, 0];
    let total = 0;

    for (const [, value] of Object.entries(data)) {
      const aspectData = this.calculateAspectSummary(value, false);

      for (let i = 0; i < aspectData.length; i++) {
        const val = aspectData[i];
        summary[i] += val;
        total += val;
      }
    }

    if (inPercentage) {
      summary = this.toPercentage(summary, total);
    }

    return summary;
  }

  public static calculateAspectSummary(data: AspectAnswerStack, inPercentage = true): number[] {
    if (data === undefined || data === null || (data as any[]).length === 0) {
      return inPercentage ? [100, 0, 0, 0, 0] : [0, 0, 0, 0, 0];
    }

    let summary = [0, 0, 0, 0, 0];
    let total = 0;

    for (const [, value] of Object.entries(data)) {
      if (value === null) {
        continue;
      }

      let index = 4 - (value - 1);

      if (index < 0 || index > 4) {
        index = 0;
      }

      summary[index]++;
      total++;
    }

    if (inPercentage) {
      summary = this.toPercentage(summary, total);
    }

    return summary;
  }

  private static toPercentage(data: number[], total: number): number[] {
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.round(100 / total * data[i]);
    }
    return data;
  }

}
