import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogState {

  private loading = new BehaviorSubject<boolean>(false);

  isLoading$(): Observable<boolean> {
    return this.loading.asObservable();
  }

  isLoading(): boolean {
    return this.loading.value;
  }

  setLoading(loading: boolean): void {
    this.loading.next(loading);
  }

}
