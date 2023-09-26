import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-filter-checkbox',
  templateUrl: './filter-checkbox.component.html',
  styleUrls: ['./filter-checkbox.component.scss']
})
export class FilterCheckboxComponent implements OnInit {
  @Input() state: FilterCheckBoxState;
  FilterCheckBoxState = FilterCheckBoxState;
  constructor() { }

  ngOnInit(): void {
  }

  onClick() {
    this.state = this.state === FilterCheckBoxState.disabled ? FilterCheckBoxState.enabled : FilterCheckBoxState.disabled;
  }
}

export enum FilterCheckBoxState {
  enabled,
  disabled,
  mixed
}
