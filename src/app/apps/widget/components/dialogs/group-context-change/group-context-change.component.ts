import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Group} from '../../../../../shared/models/group';
import {FormControl} from '@angular/forms';
import {GroupFacade} from '../../../../../store/facade/group.facade';

@Component({
  selector: 'app-group-context-change',
  templateUrl: './group-context-change.component.html',
  styleUrls: ['./group-context-change.component.scss']
})
export class GroupContextChangeComponent implements OnInit {
  groupFormControl = new FormControl('', []);
  selectedGroup: Group;
  availableGroups: Group[];

  constructor(
    public dialogRef: MatDialogRef<GroupContextChangeComponent>,
    private groupFacade: GroupFacade
  ) { }

  ngOnInit(): void {
    this.groupFormControl.setValue(this.groupFacade.getCurrentGroupSnapshot());
    this.availableGroups = this.groupFacade.getGroupsSnapshot();
  }

  onConfirm() {
    this.groupFacade.setCurrentGroup(this.groupFormControl.value);
    this.dialogRef.close();
  }

  compareGroup(g1: Group, g2: Group) {
    return g1.id === g2.id;
  }
}
