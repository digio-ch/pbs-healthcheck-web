import { Component, inject, input, output, TemplateRef, viewChild } from '@angular/core';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { ExportDialogComponent } from '../export-dialog/export-dialog.component';
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-export-button',
  imports: [ExportDialogComponent, TranslatePipe, MatIcon, MatIconButton],
  templateUrl: './export-button.component.html',
  styleUrl: './export-button.component.scss',
})
export class ExportButtonComponent {
  private dialogService = inject(DialogService);

  readonly onExport = output();
  
  readonly exportDialogRef = viewChild.required<TemplateRef<ExportDialogComponent>>('exportDialog');

  readonly date = input.required<moment.Moment>();
  readonly isExportOfSharedQuaps = input<boolean>(false);
  readonly disabled = input<boolean>();

  openExportDialog(): void {
    this.dialogService.open(this.exportDialogRef());
  }

  async onClose(doExport: boolean) {
    await this.dialogService.close(this.exportDialogRef());

    if (!doExport) {
      return;
    }

    this.onExport.emit();
  }
}
