import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable({
  providedIn: "root"
})
export class ScreenService {

  readonly componentHeights$: BehaviorSubject<Record<string, number>>;
  
  constructor() {
    this.componentHeights$ = new BehaviorSubject({});
  }

  addTrackComponent(component: string, height: number): void {
    this.componentHeights$.next({ ...this.componentHeights$.value, [component]: height });
  }
}
