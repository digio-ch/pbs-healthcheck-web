import { Component, Input, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    imports: [NgClass]
})
export class LoadingComponent implements OnInit {

  @Input() position = 'absolute';

  constructor() { }

  ngOnInit(): void {
  }

}
