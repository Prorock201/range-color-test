import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getDataFromLocalStorage(key: string) {
    return localStorage.getItem(key);
  }

  updateLocalStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
