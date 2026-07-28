import { Component, inject } from '@angular/core';
import { combineLatest, merge, of } from 'rxjs';
import { SharedAnswerState } from '../../state/shared-answer.state';
import { filter, switchMap } from 'rxjs/operators';
import { GroupFacade } from '../../../../store/facade/group.facade';
import { DateFacade } from '../../../../store/facade/date.facade';
import { DateSelection } from '../../../../shared/models/date-selection/date-selection';
import { TranslateService } from '@ngx-translate/core';

import { RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { QuapExportFacade } from '../../facades/quap-export.facade';

@Component({
    providers: [QuapExportFacade],
    selector: 'app-quap-shared-app-shell',
    templateUrl: './quap-shared-app-shell.component.html',
    styleUrls: ['./quap-shared-app-shell.component.scss'],
    imports: [RouterOutlet]
})
export class QuapSharedAppShellComponent {
  private groupFacade = inject(GroupFacade);
  private dateFacade = inject(DateFacade);
  readonly sharedAnswerState = inject(SharedAnswerState);
  private translateService = inject(TranslateService);

  constructor() {
    // ensure that the date selection is always a snapshot rather than a range
    this.dateFacade.getDateSelection$().pipe(
      filter(dateSelection => dateSelection.isRange),
      takeUntilDestroyed(),
    ).subscribe(selection => 
      this.dateFacade.setDateSelection(
        new DateSelection(selection.startDate, null, false)
      )
    );

    const langSwitch$ = merge(
      of(null), // trigger if the page is loaded after the initial onLangChange
      this.translateService.onLangChange
    );

    combineLatest([
      this.groupFacade.getCurrentGroup$(),
      this.dateFacade.getDateSelection$(),
      langSwitch$,
    ]).pipe(
      switchMap(([group, dateSelection]) => 
        this.sharedAnswerState.loadAnswers(group.id, dateSelection)
      ),
      takeUntilDestroyed(),
    ).subscribe();
  }
}
