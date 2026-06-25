import { Observable } from "rxjs";

export interface Loadable {
  isLoading$(): Observable<boolean>
}