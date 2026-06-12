import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GamificationPopupComponent } from './gamification/gamification-popup/gamification-popup.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [RouterOutlet, GamificationPopupComponent]
})
export class AppComponent {
  constructor() { }
}
