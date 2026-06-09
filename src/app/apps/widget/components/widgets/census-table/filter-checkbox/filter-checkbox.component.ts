import { Component, Input, OnInit } from '@angular/core';

import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-filter-checkbox',
    templateUrl: './filter-checkbox.component.html',
    styleUrls: ['./filter-checkbox.component.scss'],
    imports: [MatIcon]
})
export class FilterCheckboxComponent implements OnInit {
  @Input() state: FilterCheckBoxState;
  FilterCheckBoxState = FilterCheckBoxState;
  constructor() { }

  ngOnInit(): void {
  }
}

export enum FilterCheckBoxState {
  enabled,
  disabled,
  mixed
}
