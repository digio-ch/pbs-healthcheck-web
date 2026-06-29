import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-switch',
    templateUrl: './switch.component.html',
    styleUrls: ['./switch.component.scss'],
    imports: [NgClass]
})
export class SwitchComponent implements OnInit {
  @Input() value: boolean;
  @Input() disabled = false;
  @Output() update = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  toggleValue(): void {
    if (this.disabled) {
      return;
    }

    this.value = !this.value;

    this.update.emit(this.value);
  }

}
