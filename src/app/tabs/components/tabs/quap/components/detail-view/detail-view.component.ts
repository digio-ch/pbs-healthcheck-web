import {Component, Input, OnInit} from '@angular/core';
import {DialogService} from '../../../../../../shared/services/dialog.service';
import {Aspect} from '../../models/aspect';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent implements OnInit {

  @Input() aspects: Aspect[];

  constructor(
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogService.close();
  }
}
