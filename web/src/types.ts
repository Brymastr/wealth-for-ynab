export interface WorthDate {
  date: string;
  worth: number;
  previous?: WorthDate;
  index?: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface Budget {
  id: string;
  name: string;
  lastModified: string;
  firstMonth: string;
  lastMonth: string;
  monthlyNetWorth?: WorthDate[];
  forecast?: WorthDate[];
  selectedStartDate?: string;
  selectedEndDate?: string;
  selectedForecastStartDate?: string;
  selectedForecastEndDate?: string;
  dateList?: string[];
}
