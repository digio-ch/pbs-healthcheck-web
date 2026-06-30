import { Component, contentChild, inject, input, TemplateRef } from '@angular/core';
import { TypeFiltersComponent } from "../type-filters/type-filters.component";
import { DatePickerInputComponent } from "../date-picker-input/date-picker-input.component";
import { MatIcon } from "@angular/material/icon";
import { toSignal } from '@angular/core/rxjs-interop';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { DefaultFilterFacade } from 'src/app/store/facade/default-filter.facade';
import { DepartmentsInfoComponent } from "src/app/apps/my-organization/components/departments-info/departments-info.component";

@Component({
  selector: 'app-department-filter',
  imports: [TypeFiltersComponent, DatePickerInputComponent, MatIcon, DepartmentsInfoComponent],
  templateUrl: './department-filter.component.html',
  styleUrl: './department-filter.component.scss',
})
export class DepartmentFilterComponent {
  private dialogService = inject(DialogService);
  private filterFacade = inject(DefaultFilterFacade);

  readonly settings = contentChild<TemplateRef<any>>('settings');

  readonly departments = input<string[]>();

  readonly isLoading = toSignal(
    this.filterFacade.isLoading$(),
    {
      initialValue: true,
    }
  );

  openSettings() {
    if (!this.settings()) {
      return;
    }

    this.dialogService.open(this.settings());
  }
}
