import { Component, inject, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { DialogController, DialogService } from 'src/app/shared/services/dialog.service';
import { LoadingComponent } from "src/app/shared/components/loading/loading.component";
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-departments-dialog',
  templateUrl: './departments-dialog.component.html',
  styleUrl: './departments-dialog.component.scss',
  imports: [TranslatePipe, LoadingComponent, MatIcon, MatIconButton],
})
export class DepartmentsDialogComponent implements DialogController {
  private dialogService = inject(DialogService);

  readonly departments = input<string[]>();

  close(): void {
    this.dialogService.close();
  }

  onCloseRequest(): Promise<boolean> {
    return Promise.resolve(true);
  }
  beforeClosed(_: any): void {}
  afterClosed(_: any): void {}
}
