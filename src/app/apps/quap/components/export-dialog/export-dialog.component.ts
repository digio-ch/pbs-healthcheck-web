import { Component, computed, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import moment from 'moment';
import { DialogController } from 'src/app/shared/services/dialog.service';

@Component({
  selector: 'app-export-dialog',
  imports: [ TranslatePipe, MatButton ],
  templateUrl: './export-dialog.component.html',
  styleUrl: './export-dialog.component.scss',
})
export class ExportDialogComponent implements DialogController {
  readonly date = input.required<moment.Moment>();
  readonly isExportOfSharedQuaps = input<boolean>(false);

  readonly onClose = output<boolean>();

  readonly formattedDate = computed(() => this.date().format('DD.MM.YYYY'));

  readonly titleKey = computed(() => this.isExportOfSharedQuaps()
    ? 'quap.export.shared.title'
    : 'quap.export.title'
  );

  readonly contentKey = computed(() => this.isExportOfSharedQuaps()
    ? 'quap.export.shared.content'
    : 'quap.export.content'
  );

  close(doExport: boolean) {
    this.onClose.emit(doExport);
  }

  onCloseRequest(): Promise<boolean> {
    return Promise.resolve(true);
  }
  beforeClosed(_: any): void {}

  afterClosed(_: any): void {}
}
