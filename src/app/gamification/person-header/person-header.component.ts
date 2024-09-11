import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-person-header',
  templateUrl: './person-header.component.html',
  styleUrls: ['./person-header.component.scss']
})
export class PersonHeaderComponent implements OnInit {

  @Input() name: string;
  @Input() title: string;
  constructor() { }

  ngOnInit(): void {
  }

}
