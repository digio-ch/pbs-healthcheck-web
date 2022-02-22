import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TabComponent} from '../../../tab/tab.component';
import {TabService} from '../../../../services/tab.service';
import {Questionnaire} from '../models/questionnaire';
import {AnswerStack} from '../models/question';
import {GraphContainerComponent} from '../components/graph-views/graph-container/graph-container.component';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {QuapSettings, QuapSettingsService} from '../services/quap-settings.service';

@Component({
  selector: 'app-quap-tab',
  templateUrl: './quap-tab.component.html',
  styleUrls: ['./quap-tab.component.scss']
})
export class QuapTabComponent extends TabComponent implements OnInit, OnDestroy {
  public static TAB_CLASS_NAME = 'QuapTabComponent';

  @ViewChild(GraphContainerComponent) graphContainer: GraphContainerComponent;

  questionnaire: Questionnaire;
  answers: AnswerStack;
  computedAnswers: AnswerStack;
  settings: QuapSettings;

  private destroyed$ = new Subject();

  constructor(
    private quapSettingsService: QuapSettingsService,
    tabService: TabService,
  ) {
    super(tabService, QuapTabComponent);
  }

  ngOnInit(): void {
    this.questionnaire = this.data[0];
    this.answers = this.data[1].answers;
    this.computedAnswers = this.data[1].computedAnswers;

    const currentSettings = this.quapSettingsService.getSettingsSnapshot();
    currentSettings.shareData = this.data[1].shareAccess;
    this.quapSettingsService.setSettings(currentSettings);

    this.quapSettingsService.getSettings$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(settings => this.settings = settings);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
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
}
