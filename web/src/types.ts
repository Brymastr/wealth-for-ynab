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

export interface DateRangeIndices {
  startIndex: number;
  endIndex: number;
}

export interface Budget {
  id: string;
  name: string;
  lastModified: string;
  firstMonth: string;
  lastMonth: string;
  monthlyNetWorth?: WorthDate[];
  forecast?: WorthDate[];
  selectedStartIndex?: number;
  selectedEndIndex?: number;
  selectedForecastStartIndex?: number;
  selectedForecastEndIndex?: number;
  selectedStartDate?: string;
  selectedEndDate?: string;
  selectedForecastStartDate?: string;
  selectedForecastEndDate?: string;
  dateList?: string[];
}
