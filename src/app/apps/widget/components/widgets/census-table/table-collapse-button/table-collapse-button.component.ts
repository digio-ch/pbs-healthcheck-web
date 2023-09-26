import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-table-collapse-button',
  templateUrl: './table-collapse-button.component.html',
  styleUrls: ['./table-collapse-button.component.scss']
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
