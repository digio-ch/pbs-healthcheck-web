import { Component, Input, OnInit } from '@angular/core';
import { HierachicalSharedAnswer, SharedAnswer } from '../../models/shared-answer';

import { SummaryViewComponent } from '../summary-view/summary-view.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-hierarchical-summary-views',
    templateUrl: './hierarchical-summary-views.component.html',
    styleUrls: ['./hierarchical-summary-views.component.scss'],
    imports: [SummaryViewComponent, RouterLink]
})
export class HierarchicalSummaryViewsComponent implements OnInit {

  @Input() hierarchicalAnswer: HierachicalSharedAnswer;
  renderDepartments: boolean
  departments: SharedAnswer[]

  constructor() { }

  ngOnInit(): void { 
    this.renderDepartments = this.childrenAreDepartments()
    if (this.renderDepartments) {
      this.departments = this.getDepartments()
    }
  }

  childrenAreDepartments(): boolean {
    return this.hierarchicalAnswer.children.every(child => child.children.length === 0)
  }

  getDepartments(): SharedAnswer[] {
    return this.hierarchicalAnswer.children.map((child) => child.value!);
  }
}
