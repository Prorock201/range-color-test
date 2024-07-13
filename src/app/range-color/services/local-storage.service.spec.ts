import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';
import { RangeColor } from '../models/range-color.model';

describe('LocalStorageService', () => {
  let localStorageService: LocalStorageService;

  beforeEach(() => {
    const store: Record<string, string> = {};

    spyOn(localStorage, 'getItem').and.callFake((key: string): string => {
      return store[key];
    });
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      store[key] = value;
    });

    TestBed.configureTestingModule({});
    localStorageService = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    expect(localStorageService).toBeTruthy();
  });

  it('getDataFromLocalStorage() should get data from localStorage', () => {
    const mockLocalStorageRangeColorKey = 'range-color';
    const mockRangeColor: RangeColor[] = [
      { fromSecond: 0, toSecond: 10, color: '#ff0000' }
    ];
    localStorage.setItem(mockLocalStorageRangeColorKey, JSON.stringify(mockRangeColor));

    const result = localStorageService.getDataFromLocalStorage(mockLocalStorageRangeColorKey)

    expect(result).toEqual(JSON.stringify(mockRangeColor));
  });

  it('updateLocalStorage() should set data to localStorage', () => {
    const mockLocalStorageRangeColorKey = 'range-color';
    const mockRangeColor: RangeColor[] = [
      { fromSecond: 0, toSecond: 10, color: '#ff0000' }
    ];

    localStorageService.updateLocalStorage(mockLocalStorageRangeColorKey, mockRangeColor);
    
    const expectedLocalStorageData = localStorage.getItem(mockLocalStorageRangeColorKey);
    expect(expectedLocalStorageData).toEqual(JSON.stringify(mockRangeColor));
  });
});
