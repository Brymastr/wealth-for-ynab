import type { WorthDate } from '@/types';
import axios from 'axios';
import { apiUrl } from './constants';

export class ForecastApi {
  private client = axios.create({ baseURL: `${apiUrl}/forecast` });
  public async getForecast(actualNetWorth: WorthDate[], periods = 120) {
    const response = await this.client.post<WorthDate[]>(
      `?granularity=monthly&periods=${periods}`,
      actualNetWorth,
    );
    return response.data;
  }
}

export const useForecastApi = () => new ForecastApi();

// async function getForecast(actualNetWorth: WorthDate[]) {
//   const response = await axios.post<WorthDate[]>(
//     `${apiUrl}/forecast?granularity=monthly&periods=120`,
//     actualNetWorth,
//   );
//   return response.data;
// }

// export default function useForecast() {
//   return { getForecast };
// }
