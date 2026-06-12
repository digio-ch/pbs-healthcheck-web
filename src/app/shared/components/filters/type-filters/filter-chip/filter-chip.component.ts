import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChipSelectionDirective } from '../chip-selection.directive';

@Component({
    selector: 'app-filter-chip',
    templateUrl: './filter-chip.component.html',
    styleUrls: ['./filter-chip.component.scss'],
    imports: [ChipSelectionDirective]
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
