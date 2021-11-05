import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  @Input() iconClass = 'icon-warning';
  @Input() messageKey: string;
  @Input() messageParams: any;
  @Input() colorCode = 'orange';
  @Input() position = 'bottom';

  showMessage = false;

  constructor() { }

  ngOnInit(): void {}

}
