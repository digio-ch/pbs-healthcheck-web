import {Component, Input, OnInit} from '@angular/core';
import {AppFacade} from '../../store/facade/app.facade';

@Component({
  selector: 'app-person-header',
  templateUrl: './person-header.component.html',
  styleUrls: ['./person-header.component.scss']
})
export class PersonHeaderComponent implements OnInit {

  name: string;
  @Input() title: string;
  constructor(private appFacade: AppFacade) { }

  ngOnInit(): void {
    this.appFacade.getPerson$().subscribe((person) => {
      this.name = person.getFullName();
    });
  }
}
