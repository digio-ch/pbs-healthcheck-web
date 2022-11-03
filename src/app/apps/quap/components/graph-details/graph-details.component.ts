import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SubdepartmentAnswer} from '../../models/subdepartment-answer';
import {ActivatedRoute} from '@angular/router';
import {Subject, Subscription} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {SubdepartmentAnswerState} from '../../state/subdepartment-answer.state';
import {QuapSettings, QuapSettingsService} from '../../services/quap-settings.service';
import {QuapService} from '../../services/quap.service';
import {FilterFacade} from '../../../../store/facade/filter.facade';
import {DialogService} from '../../../../shared/services/dialog.service';
import {Questionnaire} from '../../models/questionnaire';
import {GraphContainerComponent} from '../graph-views/graph-container/graph-container.component';
import {BreadcrumbService} from '../../../../shared/services/breadcrumb.service';

@Component({
  selector: 'app-graph-details',
  templateUrl: './graph-details.component.html',
  styleUrls: ['./graph-details.component.scss']
})
export class GraphDetailsComponent implements OnInit, OnDestroy {

  @ViewChild(GraphContainerComponent) graphContainer: GraphContainerComponent;

  questionnaire: Questionnaire;
  data: SubdepartmentAnswer;
  settings: QuapSettings;

  private groupSubscription: Subscription;
  private destroyed$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private filterFacade: FilterFacade,
    private quapService: QuapService,
    private quapSettingsService: QuapSettingsService,
    private subdepartmentAnswerState: SubdepartmentAnswerState,
    private breadcrumbService: BreadcrumbService,
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

        this.breadcrumbService.pushBreadcrumb({
          name: data.groupName,
          path: `app/quap-departments/${data.groupId}`,
        });

        this.quapService.getQuestionnaire(this.filterFacade.getDateSelectionSnapshot(), data.groupTypeId).pipe(
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
