import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {TypeFilter} from '../../../../../shared/models/type-filter';

@Component({
  selector: 'app-filter-chip',
  templateUrl: './filter-chip.component.html',
  styleUrls: ['./filter-chip.component.scss']
})
export class FilterChipComponent implements OnInit {
  @Input() disabled: boolean;
  @Input() selected: boolean;
  @Input() color: string;
  @Output() selectionChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  onClick() {
    if (this.disabled) {
      return;
    }
    this.selectionChange.emit(!this.selected);
  }

}
