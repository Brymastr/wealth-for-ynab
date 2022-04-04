import axios from 'axios';
import { apiUrl } from './constants';
import { WorthDate } from '@/composables/types';

async function getForecast(actualNetWorth: WorthDate[]) {
  const response = await axios.post<WorthDate[]>(
    `${apiUrl}/forecast?granularity=monthly&periods=120`,
    actualNetWorth,
  );
  return response.data;
}

export default function useForecast() {
  return { getForecast };
}
