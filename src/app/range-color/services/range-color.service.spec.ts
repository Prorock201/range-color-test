import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { RangeColorService } from './range-color.service';
import { BehaviorSubject, of } from 'rxjs';
import { RangeColor } from '../models/range-color.model';
import { LocalStorageService } from './local-storage.service';

describe('RangeColorService', () => {
  let rangeColorService: RangeColorService;
  let mockLocalStorageService = jasmine.createSpyObj('LocalStorageService', ['getDataFromLocalStorage', 'updateLocalStorage'])
  let currentTimerSubject: BehaviorSubject<number>;
  let rangeColorSubject: BehaviorSubject<RangeColor[]>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RangeColorService,
        { provide: LocalStorageService, useValue: mockLocalStorageService }
      ]
    });

    rangeColorService = TestBed.inject(RangeColorService);
    currentTimerSubject = new BehaviorSubject<number>(0);
    rangeColorSubject = new BehaviorSubject<RangeColor[]>([
      { fromSecond: 0, toSecond: 10, color: '#ff0000' },
      { fromSecond: 11, toSecond: 20, color: '#00ff00' }
    ]);

    jasmine.clock().install();
    const baseTime = new Date('Sat Jul 10 2024 08:39:17');
    jasmine.clock().mockDate(baseTime);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(rangeColorService).toBeTruthy();
  });

  it('constructor() should call init functions in the constructor', () => {
    const spyInitTimer = spyOn(RangeColorService.prototype as any, 'initTimer');
    const spyInitRangeColorUpdater = spyOn(RangeColorService.prototype as any, 'initRangeColorUpdater');
    const spyInitTimeUpdater = spyOn(RangeColorService.prototype as any, 'initTimeUpdater');
    const spyInitRangeColorData = spyOn(RangeColorService.prototype as any, 'initRangeColorData');

    rangeColorService = new RangeColorService(mockLocalStorageService);

    expect(spyInitTimer).toHaveBeenCalled();
    expect(spyInitRangeColorUpdater).toHaveBeenCalled();
    expect(spyInitTimeUpdater).toHaveBeenCalled();
    expect(spyInitRangeColorData).toHaveBeenCalled();
  });

  it('initTimer() should emit the current timer', (done: DoneFn) => {
    const mockSeconds = new Date('Sat Jul 10 2024 08:39:17').getSeconds();

    rangeColorService.currentTimer$.subscribe(second => {
      expect(mockSeconds).toBe(new Date().getSeconds());
      done();
    });
  });

  it('initTimeUpdater() should update range color when needed', fakeAsync(() => {
    const spyUpdateRangeColor = spyOn(rangeColorService as any, 'updateRangeColor');

    (rangeColorService as any).currentTimerSubject.next(55);
    expect(spyUpdateRangeColor).toHaveBeenCalledTimes(1);

    (rangeColorService as any).currentTimerSubject.next(5);
    expect(spyUpdateRangeColor).toHaveBeenCalledTimes(2);

    (rangeColorService as any).currentTimerSubject.next(7);
    expect(spyUpdateRangeColor).toHaveBeenCalledTimes(3);

    (rangeColorService as any).currentTimerSubject.next(12);
    expect(spyUpdateRangeColor).toHaveBeenCalledTimes(4);
  }));

  it('updateRangeColor() should set the default color', () => {
    let color: string | undefined;

    rangeColorService.currentColor$.subscribe(c => color = c);

    (rangeColorService as any).currentTimerSubject.next(50);
    expect(color).toBe('#fff');
  });

  it('updateRangeColor() should update color when rangeColor change', () => {
    let color: string | undefined;

    rangeColorService.currentColor$.subscribe(c => color = c);

    (rangeColorService as any).rangeColorSubject.next([
      { fromSecond: 0, toSecond: 51, color: '#0000ff' }
    ]);

    expect(color).toBe('#0000ff');
  });

  it('addRangeColorItem() should add range color item', () => {
    const mockLocalStorageRangeColorKey = 'range-color';
    const mockRangeColor: RangeColor = { fromSecond: 0, toSecond: 10, color: '#ff0000' };
    const mockRangeColorSubjectNext = spyOn((rangeColorService as any).rangeColorSubject, 'next');
    rangeColorService.hasCreateRow =  true;

    rangeColorService.addRangeColorItem(mockRangeColor);

    expect(rangeColorService.hasCreateRow).toEqual(false);
    expect(mockRangeColorSubjectNext).toHaveBeenCalled();
    expect(mockLocalStorageService.updateLocalStorage).toHaveBeenCalledWith(mockLocalStorageRangeColorKey, [mockRangeColor]);
  });

  it('removeRangeColorItem() should remove range color item', () => {
    const mockLocalStorageRangeColorKey = 'range-color';
    const mockColor: string = '#ff0000';
    (rangeColorService as any).rangeColor = [
      { fromSecond: 0, toSecond: 10, color: '#ff0000' }
    ];
    const mockRangeColorSubjectNext = spyOn((rangeColorService as any).rangeColorSubject, 'next');

    rangeColorService.removeRangeColorItem(mockColor);

    expect(mockRangeColorSubjectNext).toHaveBeenCalledWith([]);
    expect(mockLocalStorageService.updateLocalStorage).toHaveBeenCalledWith(mockLocalStorageRangeColorKey, []);
  });
});
