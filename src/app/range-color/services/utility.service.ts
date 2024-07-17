import { Injectable } from '@angular/core';
import { RangeColor } from '../models/range-color.model';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  public binaryTimeRangeSearch(sortedArray: RangeColor[], from: number, to: number =  0){
    let start = 0;
    let end = sortedArray.length - 1;

    while (start <= end) {
        let middle = Math.floor((start + end) / 2);
        const matchCondition =
          to ? 
          from <= sortedArray[middle].toSecond && to >= sortedArray[middle].fromSecond :
          sortedArray[middle].fromSecond <= from && sortedArray[middle].toSecond >= from;
        if (matchCondition) {
            return middle;
        } else if (sortedArray[middle].fromSecond < from) {
            start = middle + 1;
        } else {
            end = middle - 1;
        }
    }
    return -1;
  }

  public binaryColorSearch(sortedArray: RangeColor[], keyStart: string){
    let start = 0;
    let end = sortedArray.length - 1;

    while (start <= end) {
        let middle = Math.floor((start + end) / 2);
        if (sortedArray[middle].color === keyStart) {
            return middle;
        } else if (sortedArray[middle].color < keyStart) {
            start = middle + 1;
        } else {
            end = middle - 1;
        }
    }
    return -1;
  }
}
