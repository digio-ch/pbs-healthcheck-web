import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { DefaultFilterFacade } from '../../../../store/facade/default-filter.facade';
import { Questionnaire } from '../../models/questionnaire';
import { SubDepartmentAnswer } from '../../models/subdepartment-answer';
import { QuapSettings, QuapSettingsService } from '../../services/quap-settings.service';
import { QuapService } from '../../services/quap.service';
import { SubdepartmentAnswerState } from '../../state/subdepartment-answer.state';
import { GraphContainerComponent } from '../graph-views/graph-container/graph-container.component';
import { NgIf } from '@angular/common';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { InfoComponent } from '../../../../shared/components/info/info.component';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-graph-details',
    templateUrl: './graph-details.component.html',
    styleUrls: ['./graph-details.component.scss'],
    imports: [NgIf, LoadingComponent, InfoComponent, MatIconButton, MatIcon, GraphContainerComponent, TranslatePipe]
})
export class GraphDetailsComponent implements OnInit, OnDestroy {

  @ViewChild(GraphContainerComponent) graphContainer: GraphContainerComponent;

  questionnaire: Questionnaire;
  data: SubDepartmentAnswer;
  settings: QuapSettings;

  private groupSubscription: Subscription;
  private destroyed$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private filterFacade: DefaultFilterFacade,
    private quapService: QuapService,
    private quapSettingsService: QuapSettingsService,
    private subdepartmentAnswerState: SubdepartmentAnswerState,
  ) { }

  get loading(): boolean {
    return this.data == null || this.questionnaire == null;
  }

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroyed$),
    ).subscribe((params: { id: number }) => {
      if (this.groupSubscription) {
        this.groupSubscription.unsubscribe();
      }

      this.groupSubscription = this.subdepartmentAnswerState.getAnswersFromGroup$(+params.id).pipe(
        takeUntil(this.destroyed$),
      ).subscribe(data => {
        this.data = data;

        this.quapService.getQuestionnaire(this.filterFacade.getDateSelectionSnapshot(), data.groupType).pipe(
          first(),
        ).subscribe(questionnaire => this.questionnaire = questionnaire);
      });
    });

    this.quapSettingsService.getSettings$().pipe(
      first(),
    ).subscribe(settings => this.settings = settings);
  }

  openEvaluationDialog(index?: number, origin?: string): void {
    this.graphContainer.openEvaluationDialog(index, origin);
  }

  openDetailDialog(index?: number, origin?: string): void {
    this.graphContainer.openDetailDialog(index, origin);
  }

  openSettingsDialog(): void {
    this.graphContainer.openSettingsDialog();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
