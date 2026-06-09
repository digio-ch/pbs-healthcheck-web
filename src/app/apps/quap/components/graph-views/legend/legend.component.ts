import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-legend',
    templateUrl: './legend.component.html',
    styleUrls: ['./legend.component.scss'],
    imports: [TranslatePipe]
})
export class LegendComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
