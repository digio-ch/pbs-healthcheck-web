import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-widget-info',
  templateUrl: './widget-info.component.html',
  styleUrls: ['./widget-info.component.scss']
})
export class WidgetInfoComponent implements OnInit {
  @Input() iconClass = 'icon-warning';
  @Input() messageKey: string;
  @Input() messageParams: any;
  @Input() colorCode: string = 'orange';
  @Input() position: string = 'bottom';

  showMessage = false;

  constructor() { }

  ngOnInit(): void {}
}
