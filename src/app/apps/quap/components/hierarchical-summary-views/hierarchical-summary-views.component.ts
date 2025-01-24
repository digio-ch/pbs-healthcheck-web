import { Component, Input, OnInit } from '@angular/core';
import { HierachicalSubDepartmentAnswer, SubDepartmentAnswer } from '../../models/subdepartment-answer';

@Component({
  selector: 'app-hierarchical-summary-views',
  templateUrl: './hierarchical-summary-views.component.html',
  styleUrls: ['./hierarchical-summary-views.component.scss']
})
export class HierarchicalSummaryViewsComponent implements OnInit {

  @Input() hierarchicalAnswer: HierachicalSubDepartmentAnswer;
  renderDepartments: boolean
  departments: SubDepartmentAnswer[]

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

  getDepartments(): SubDepartmentAnswer[] {
    return this.hierarchicalAnswer.children.map((child) => child.parent!);
  }
}
