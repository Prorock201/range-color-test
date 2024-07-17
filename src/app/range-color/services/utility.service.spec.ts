import { TestBed } from '@angular/core/testing';

import { UtilityService } from './utility.service';
import { RangeColor } from '../models/range-color.model';

describe('UtilityService', () => {
  let service: UtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('binaryTimeRangeSearch() should return index of found object', () => {
    const mockRangeColor: RangeColor[] = [
      { fromSecond:6, toSecond:7, color: '#000000' },
      { fromSecond:10, toSecond:20, color: '#b81414' },
      { fromSecond:21, toSecond:30, color: '#1bd317' },
      { fromSecond:31, toSecond:40, color:'#0320fc' },
      { fromSecond:41, toSecond:50, color: '#e5d41f' },
      { fromSecond:51, toSecond:52, color: '#a18787' },
      { fromSecond:56, toSecond:57, color: '#938f1f' },
      { fromSecond:58, toSecond:59, color: '#4dc7a8' }
    ];
    const mockTimer = 45;
    const expectedResult = 4;

    const result = service.binaryTimeRangeSearch(mockRangeColor, mockTimer);

    expect(result).toEqual(expectedResult);
  });

  it('binaryTimeRangeSearch() should return -1 if object was not found', () => {
    const mockRangeColor: RangeColor[] = [
      { fromSecond:6, toSecond:7, color: '#000000' },
      { fromSecond:10, toSecond:20, color: '#b81414' },
      { fromSecond:21, toSecond:30, color: '#1bd317' },
      { fromSecond:31, toSecond:40, color:'#0320fc' },
      { fromSecond:41, toSecond:50, color: '#e5d41f' },
      { fromSecond:51, toSecond:52, color: '#a18787' },
      { fromSecond:56, toSecond:57, color: '#938f1f' },
      { fromSecond:58, toSecond:59, color: '#4dc7a8' }
    ];
    const mockTimer = 1;
    const expectedResult = -1;

    const result = service.binaryTimeRangeSearch(mockRangeColor, mockTimer);

    expect(result).toEqual(expectedResult);
  });

  it('binaryColorSearch() should return index of found object', () => {
    const mockRangeColor: RangeColor[] = [
      { fromSecond:6, toSecond:7, color: '#000000' },
      { fromSecond:10, toSecond:20, color: '#b81414' },
      { fromSecond:21, toSecond:30, color: '#1bd317' },
      { fromSecond:31, toSecond:40, color:'#0320fc' },
      { fromSecond:41, toSecond:50, color: '#e5d41f' },
      { fromSecond:51, toSecond:52, color: '#a18787' },
      { fromSecond:56, toSecond:57, color: '#938f1f' },
      { fromSecond:58, toSecond:59, color: '#4dc7a8' }
    ];
    const mockColor = '#0320fc';
    const expectedResult = 3;

    const result = service.binaryColorSearch(mockRangeColor, mockColor);

    expect(result).toEqual(expectedResult);
  });

  it('binaryColorSearch() should return -1 if object was not found', () => {
    const mockRangeColor: RangeColor[] = [
      { fromSecond:6, toSecond:7, color: '#000000' },
      { fromSecond:10, toSecond:20, color: '#b81414' },
      { fromSecond:21, toSecond:30, color: '#1bd317' },
      { fromSecond:31, toSecond:40, color:'#0320fc' },
      { fromSecond:41, toSecond:50, color: '#e5d41f' },
      { fromSecond:51, toSecond:52, color: '#a18787' },
      { fromSecond:56, toSecond:57, color: '#938f1f' },
      { fromSecond:58, toSecond:59, color: '#4dc7a8' }
    ];
    const mockColor = '#ff0000';
    const expectedResult = -1;

    const result = service.binaryColorSearch(mockRangeColor, mockColor);

    expect(result).toEqual(expectedResult);
  });
});
