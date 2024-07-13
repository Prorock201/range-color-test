import { Injectable } from '@angular/core';
import { RangeColor } from '../models/range-color.model';
import { BehaviorSubject, Observable, Subject, Subscription, filter, map, takeUntil, timer, withLatestFrom } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class RangeColorService {
  public hasCreateRow: boolean = false;

  private localStorageRangeColorKey = 'range-color';
  private rangeColor: RangeColor[] = [];
  private rangeColorSubject = new BehaviorSubject<RangeColor[]>(this.rangeColor);
  public rangeColor$ = this.rangeColorSubject.asObservable();

  private defaultColor: string = '#fff';
  private activeRangeColor: RangeColor | null = null;
  private destroy$ = new Subject<void>();
  private currentColorSubject = new BehaviorSubject<string>(this.defaultColor);
  public currentColor$ = this.currentColorSubject.asObservable();

  private currentTimerSubject = new BehaviorSubject<number>(new Date().getSeconds());
  public currentTimer$ = this.currentTimerSubject.asObservable();
  private timerSubscription!: Subscription;

  constructor(
    private localStorageService: LocalStorageService
  ) {
    this.initTimer();
    this.initRangeColorUpdater();
    this.initTimeUpdater();
    this.initRangeColorData();
  }

  private initTimer() {
    this.timerSubscription = 
      timer(0, 1000).pipe(map((n) => new Date().getSeconds()))
      .subscribe(val => this.currentTimerSubject.next(val));
  }

  private initRangeColorUpdater() {
    this.rangeColor$
      .pipe(
        withLatestFrom(this.currentTimer$),
        takeUntil(this.destroy$)
      )
      .subscribe(([rangeColor, timer]) => {
        this.updateRangeColor(rangeColor, timer);
      });
  }

  private initTimeUpdater() {
    this.currentTimer$
      .pipe(
        filter((timer) => {
          return !this.activeRangeColor
          || timer < this.activeRangeColor.fromSecond
          || timer > this.activeRangeColor.toSecond
        }),
        withLatestFrom(this.rangeColor$),
        takeUntil(this.destroy$)
      )
      .subscribe(([timer, rangeColor]) => {
        this.updateRangeColor(rangeColor, timer);
      });
  }

  private initRangeColorData() {
    const localStorageData = this.localStorageService.getDataFromLocalStorage(this.localStorageRangeColorKey)
    if (localStorageData) {
      try {
        this.rangeColor = JSON.parse(localStorageData);
        this.rangeColorSubject.next(this.rangeColor);
      } catch (error) {
        console.error('Error parsing data from local storage', error);
      }
    }
  }

  public updateRangeColor(rangeColor: RangeColor[], timer: number) {
    let newActiveRangeColor = null;

    for (let entry of rangeColor) {
      if (entry.fromSecond <= timer && entry.toSecond >= timer) {
        newActiveRangeColor = entry;
        break;
      }
    }

    if (newActiveRangeColor !== this.activeRangeColor) {
      this.activeRangeColor = newActiveRangeColor;

      const newColor = newActiveRangeColor?.color ?? this.defaultColor;

      this.currentColorSubject.next(newColor);
    }
  }

  addRangeColorItem(rangeColor: RangeColor) {
    this.hasCreateRow = false;
    this.rangeColor = [...this.rangeColor, rangeColor].sort((a, b) => a.fromSecond - b.fromSecond);
    this.rangeColorSubject.next(this.rangeColor);
    this.localStorageService.updateLocalStorage(this.localStorageRangeColorKey, this.rangeColor);
  }

  removeRangeColorItem(color: string) {
    this.rangeColor = this.rangeColor.filter(item => item.color !== color);
    this.rangeColorSubject.next(this.rangeColor);
    this.localStorageService.updateLocalStorage(this.localStorageRangeColorKey, this.rangeColor);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.timerSubscription.unsubscribe();
  }
}
