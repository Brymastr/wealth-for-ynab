import type { Budget, WorthDate, DateRangeIndices } from '@/types';
import type { ComputedRef } from 'vue';
import type { IBackend } from './backend';
import BaseBackend from './BaseBackend';
import { BackendType, LoadingStatus } from './types';

class NoneBackend extends BaseBackend implements IBackend {
  constructor() {
    super(BackendType.none);
  }
  loadBudgets(): Promise<void> {
    console.error('Method not implemented.')
    return Promise.resolve()
  }
  loadNetWorth(): Promise<void> {
    console.error('Method not implemented.')
    return Promise.resolve()
  }
}

export const noneBackend = new NoneBackend();
