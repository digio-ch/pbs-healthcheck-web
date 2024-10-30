import {Component, Input, OnInit} from '@angular/core';
import {AppFacade} from '../../store/facade/app.facade';
import {GamificationFacade} from '../../store/facade/gamification.facade';

@Component({
  selector: 'app-person-header',
  templateUrl: './person-header.component.html',
  styleUrls: ['./person-header.component.scss']
})
export class PersonHeaderComponent implements OnInit {

  badges: string[];
  name: string;
  @Input() title: string;
  constructor(private appFacade: AppFacade, private gamificationFacade: GamificationFacade) {
    this.gamificationFacade.badges$.subscribe(badges => {this.badges = badges; });
  }

  ngOnInit(): void {
    this.appFacade.getPerson$().subscribe((person) => {
      this.name = person.getFullName();
    });
  }
}
