import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SubdepartmentAnswer} from '../../models/subdepartment-answer';
import {ActivatedRoute} from '@angular/router';
import {Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {SubdepartmentAnswerState} from '../../state/subdepartment-answer.state';
import {QuapSettings, QuapSettingsService} from '../../../quap/services/quap-settings.service';
import {QuapService} from '../../../quap/services/quap.service';
import {FilterFacade} from '../../../../../../store/facade/filter.facade';
import {DialogService} from '../../../../../../shared/services/dialog.service';
import {Questionnaire} from '../../../quap/models/questionnaire';
import {GraphContainerComponent} from '../../../quap/components/graph-views/graph-container/graph-container.component';

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
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroyed$),
    ).subscribe((params: { id: number }) => {
      if (this.groupSubscription) {
        this.groupSubscription.unsubscribe();
      }

      this.groupSubscription = this.subdepartmentAnswerState.getAnswersFromGroup$(+params.id).pipe(
        takeUntil(this.destroyed$),
      ).subscribe(data => this.data = data);
    });

    this.quapSettingsService.getSettings$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(settings => this.settings = settings);

    this.quapService.getQuestionnaire(this.filterFacade.getDateSelectionSnapshot()).pipe(
      takeUntil(this.destroyed$),
    ).subscribe(questionnaire => this.questionnaire = questionnaire);
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
