import { subMonths, addMonths } from 'date-fns';
import { formatEndOfMonth } from '@/services/helper';
import type { WorthDate } from '@/types';

export class DummyDataApi {
  private randomNumber(minLength = 8, maxLength = 50) {
    return ~~(Math.random() * (maxLength - minLength + 1) + minLength);
  }

  private generateRandomDataset(seriesLength: number) {
    const dataset: number[] = [];
    const modifier = this.randomNumber(1, 10);

    const probability = [-1933, -554, 190, 534, 674, 722, 930, 1687, 2329, 3542].map(x => x * modifier);
    let currentValue = this.randomNumber(-50000, 100000);

    for (let i = 0; i < seriesLength; i++) {
      const random = this.randomNumber(1, 10);

      currentValue += probability[random - 1];

      dataset.push(currentValue);
    }

    return dataset;
  }

  private getDateRange(seriesLength: number) {
    const date = subMonths(new Date(), seriesLength);

    const dates: string[] = [];

    for (let i = 0; i <= seriesLength; i++) {
      const d = formatEndOfMonth(addMonths(date, i).toISOString());
      dates.push(d);
    }

    return dates;
  }

  public generateNetWorth() {
    const seriesLength = this.randomNumber();

    const dates = this.getDateRange(seriesLength);
    const values: number[] = this.generateRandomDataset(seriesLength);

    const result: WorthDate[] = [];

    for (let i = 0; i < seriesLength; i++) {
      const x: WorthDate = {
        date: dates[i],
        worth: values[i],
      };

      if (i !== 0) {
        const { date, worth } = result[i - 1];
        x.previous = { date, worth };
      }

      result.push(x);
    }

    return result;
  }
}

export const useDummyDataApi = () => new DummyDataApi();
