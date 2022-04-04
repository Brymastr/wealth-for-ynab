export interface WorthDate {
  date: string;
  worth: number;
  previous?: WorthDate;
  index?: number;
}

export enum LoadingStatus {
  'loading',
  'complete',
  'ready',
}

export interface DateRange {
  startDate?: string;
  endDate?: string;
}
