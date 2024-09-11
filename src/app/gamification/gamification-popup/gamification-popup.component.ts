import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-gamification-popup',
  templateUrl: './gamification-popup.component.html',
  styleUrls: ['./gamification-popup.component.scss']
})
export class GamificationPopupComponent implements OnInit {
  @Input() title: string;
  @Output() closePopup = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  close(): void {
    this.closePopup.emit([]);
  }

}
