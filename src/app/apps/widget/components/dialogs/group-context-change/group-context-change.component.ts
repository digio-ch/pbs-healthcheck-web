import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Group } from '../../../../../shared/models/group';
import { GroupFacade } from '../../../../../store/facade/group.facade';
import { Router } from '@angular/router';
import { GamificationService } from '../../../../../store/services/gamification.service';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';

import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-group-context-change',
    templateUrl: './group-context-change.component.html',
    styleUrls: ['./group-context-change.component.scss'],
    imports: [CdkScrollable, MatDialogContent, MatFormField, MatSelect, FormsModule, ReactiveFormsModule, MatOption, MatDialogActions, MatButton, MatDialogClose, TranslatePipe]
})
export class GroupContextChangeComponent implements OnInit {
  groupFormControl = new UntypedFormControl('', []);
  selectedGroup: Group;
  availableGroups: Group[];

  constructor(
    public dialogRef: MatDialogRef<GroupContextChangeComponent>,
    private groupFacade: GroupFacade,
    private router: Router,
    private gamificationService: GamificationService,
  ) { }

  ngOnInit(): void {
    this.groupFormControl.setValue(this.groupFacade.getCurrentGroupSnapshot());
    this.availableGroups = this.groupFacade.getGroupsSnapshot();
  }

  onConfirm() {
    const newGroup = this.groupFormControl.value;
    this.gamificationService.logGroupChange(newGroup);
    this.groupFacade.setCurrentGroup(newGroup);
    this.dialogRef.close();
    this.router.navigate(['dashboard']);
  }

  compareGroup(g1: Group, g2: Group) {
    return g1.id === g2.id;
  }
}
