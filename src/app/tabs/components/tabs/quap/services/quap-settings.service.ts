import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuapSettingsService {
  private LOCALSTORAGE_KEY = 'quap.settings';

  private settings$: BehaviorSubject<QuapSettings> = new BehaviorSubject<QuapSettings>(null);

  constructor() {
    let settings = this.loadSettings();
    if (!settings) {
      settings = defaultQuapSettings;
      this.saveSettings(settings);
    }

    this.setSettings(settings);
  }

  public getSettings$(): Observable<QuapSettings> {
    return this.settings$.asObservable();
  }

  public getSettingsSnapshot(): QuapSettings {
    return this.settings$.value;
  }

  public setSettings(settings: QuapSettings): void {
    this.saveSettings(settings);

    this.settings$.next(settings);
  }

  private loadSettings(): QuapSettings {
    return JSON.parse(localStorage.getItem(this.LOCALSTORAGE_KEY));
  }

  private saveSettings(settings: QuapSettings): void {
    localStorage.setItem(this.LOCALSTORAGE_KEY, JSON.stringify(settings));
  }
}

export interface QuapSettings {
  showNotRelevant: boolean;
}

const defaultQuapSettings: QuapSettings = {
  showNotRelevant: false,
};
