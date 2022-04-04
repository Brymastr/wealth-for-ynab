import { subMonths, addMonths } from 'date-fns';
import { WorthDate } from '@/composables/types';
import { formatEndOfMonth } from '@/services/helper';

function generateRandomDataset(seriesLength: number) {
  const dataset: number[] = [];
  const modifier = randomNumber(1, 10);

  const probability = [-1933, -554, 190, 534, 674, 722, 930, 1687, 2329, 3542].map(x => x * modifier);
  let currentValue = randomNumber(-50000, 100000);

  for (let i = 0; i < seriesLength; i++) {
    const random = randomNumber(1, 10);

    currentValue += probability[random - 1];

    dataset.push(currentValue);
  }

  return dataset;
}

function getDateRange(seriesLength: number) {
  const date = subMonths(new Date(), seriesLength);

  const dates: string[] = [];

  for (let i = 0; i <= seriesLength; i++) {
    const d = formatEndOfMonth(addMonths(date, i).toISOString());
    dates.push(d);
  }

  return dates;
}

function generateNetWorth() {
  const seriesLength = randomNumber();

  const dates = getDateRange(seriesLength);
  const values: number[] = generateRandomDataset(seriesLength);

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

function randomNumber(minLength = 8, maxLength = 50) {
  return ~~(Math.random() * (maxLength - minLength + 1) + minLength);
}

export default function useDummy() {
  return { generateNetWorth };
}
