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
}

export enum FilterCheckBoxState {
  enabled,
  disabled,
  mixed
}
