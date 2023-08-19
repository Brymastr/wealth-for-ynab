import { Budget, WorthDate, DateRangeIndices } from '@/types';
import { ComputedRef } from 'vue';
import { IBackend } from './backend';
import BaseBackend from './BaseBackend';
import { BackendType, LoadingStatus } from './types';

class NoneBackend extends BaseBackend implements IBackend {
  constructor() {
    super(BackendType.none);
  }
  loadBudgets(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  loadNetWorth(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export const noneBackend = new NoneBackend();