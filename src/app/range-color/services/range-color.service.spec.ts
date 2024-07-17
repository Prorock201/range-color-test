import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { RangeColorService } from './range-color.service';
import { BehaviorSubject, of, withLatestFrom } from 'rxjs';
import { RangeColor } from '../models/range-color.model';
import { LocalStorageService } from './local-storage.service';
import { UtilityService } from './utility.service';

describe('RangeColorService', () => {
  let rangeColorService: RangeColorService;
  let mockLocalStorageService = jasmine.createSpyObj('LocalStorageService', ['getDataFromLocalStorage', 'updateLocalStorage']);
  let mockUtilityService = jasmine.createSpyObj('UtilityService', ['binaryTimeRangeSearch', 'binaryColorSearch'])
  let currentTimerSubject: BehaviorSubject<number>;
  let rangeColorSubject: BehaviorSubject<RangeColor[]>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RangeColorService,
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: UtilityService, useValue: mockUtilityService }
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

    rangeColorService = new RangeColorService(mockLocalStorageService, mockUtilityService);

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

  it('initRangeColorUpdater() should call updateRangeColor', fakeAsync(() => {
    const spyUpdateRangeColor = spyOn(rangeColorService as any, 'updateRangeColor');
    const mockTimer = 17;
    const mockRangeColor: RangeColor[] = [
      { fromSecond:6, toSecond:7, color: '#000000' },
      { fromSecond:21, toSecond:30, color: '#1bd317' },
      { fromSecond:31, toSecond:40, color:'#0320fc' },
      { fromSecond:56, toSecond:57, color: '#938f1f' },
      { fromSecond:58, toSecond:59, color: '#4dc7a8' }
    ];

    (rangeColorService as any).currentTimerSubject.next(mockTimer);
    (rangeColorService as any).rangeColorSubject.next(mockRangeColor);
    rangeColorService.rangeColor$
      .pipe(withLatestFrom(rangeColorService.currentTimer$))
      .subscribe(([rangeColor, timer]) => {
        expect(timer).toEqual(mockTimer);
        expect(rangeColor).toEqual(mockRangeColor);
        expect(spyUpdateRangeColor).toHaveBeenCalledWith(rangeColor, timer);
    });
  }));

  it('initTimeUpdater() should update range color when it needed', fakeAsync(() => {
    const spyUpdateRangeColor = spyOn(rangeColorService as any, 'updateRangeColor');
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
    (rangeColorService as any).activeRangeColor = {
      fromSecond: 10,
      toSecond: 20,
      color: '#b81414'
    };

    (rangeColorService as any).rangeColorSubject.next(mockRangeColor);
    expect(spyUpdateRangeColor).toHaveBeenCalledTimes(1);

    (rangeColorService as any).currentTimerSubject.next(8);
    expect(spyUpdateRangeColor).toHaveBeenCalledTimes(2);

    (rangeColorService as any).currentTimerSubject.next(11);
    expect(spyUpdateRangeColor).toHaveBeenCalledTimes(2);

    (rangeColorService as any).currentTimerSubject.next(15);
    expect(spyUpdateRangeColor).toHaveBeenCalledTimes(2);

    (rangeColorService as any).currentTimerSubject.next(19);
    expect(spyUpdateRangeColor).toHaveBeenCalledTimes(2);

    (rangeColorService as any).currentTimerSubject.next(21);
    expect(spyUpdateRangeColor).toHaveBeenCalledTimes(3);
  }));

  it('initTimeUpdater() should call updateRangeColor', fakeAsync(() => {
    const spyUpdateRangeColor = spyOn(rangeColorService as any, 'updateRangeColor');
    const mockTimer = 7;
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

    (rangeColorService as any).currentTimerSubject.next(mockTimer);
    (rangeColorService as any).rangeColorSubject.next(mockRangeColor);
    rangeColorService.currentTimer$
      .pipe(withLatestFrom(rangeColorService.rangeColor$))
      .subscribe(([timer, rangeColor]) => {
        expect(timer).toEqual(mockTimer);
        expect(rangeColor).toEqual(mockRangeColor);
        expect(spyUpdateRangeColor).toHaveBeenCalledWith(rangeColor, timer);
    });
  }));

  it('updateRangeColor() should set the default color', () => {
    let color: string | undefined;
    const mockDefaultColor = '#fff';
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
    const mockFoundIndex = -1;
    mockUtilityService.binaryTimeRangeSearch.and.returnValue(mockFoundIndex);
    rangeColorService.currentColor$.subscribe(c => color = c);

    (rangeColorService as any).rangeColorSubject.next(mockRangeColor);
    expect(color).toBe(mockDefaultColor);
  });

  it('updateRangeColor() should set new active color', () => {
    let color: string | undefined;
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
    const mockFoundIndex = 1;
    mockUtilityService.binaryTimeRangeSearch.and.returnValue(mockFoundIndex);
    rangeColorService.currentColor$.subscribe(c => color = c);

    (rangeColorService as any).rangeColorSubject.next(mockRangeColor);

    expect(color).toBe(mockRangeColor[mockFoundIndex].color);
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

  it('ngOnDestroy() should unsubscribe on destroy', () => {
    rangeColorService = new RangeColorService(mockLocalStorageService, mockUtilityService);
    const mockNext = spyOn((rangeColorService as any).destroy$, 'next');
    const mockComplete = spyOn((rangeColorService as any).destroy$, 'complete');

    rangeColorService.ngOnDestroy();

    expect(mockNext).toHaveBeenCalled();
    expect(mockComplete).toHaveBeenCalled();
  });
});
