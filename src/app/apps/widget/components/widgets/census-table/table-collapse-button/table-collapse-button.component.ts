import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-table-collapse-button',
    templateUrl: './table-collapse-button.component.html',
    styleUrls: ['./table-collapse-button.component.scss'],
    imports: [MatIcon]
})
export class TableCollapseButtonComponent implements OnInit {
  @Input() collapsed: boolean;
  @Output() selectionChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  onClick() {
    this.selectionChange.emit(!this.collapsed);
  }

}
