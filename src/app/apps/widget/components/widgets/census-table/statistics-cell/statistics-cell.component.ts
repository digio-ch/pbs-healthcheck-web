import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-statistics-cell',
  templateUrl: './statistics-cell.component.html',
  styleUrls: ['./statistics-cell.component.scss']
})
export class StatisticsCellComponent implements OnInit {
  @Input() value = 0;
  constructor() { }

  ngOnInit(): void {
  }

}
