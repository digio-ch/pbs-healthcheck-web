import {Component, OnInit, ViewChild} from '@angular/core';
import {WidgetComponent} from '../widget/widget.component';
import {WidgetTypeService} from '../../../services/widget-type.service';
import {RawRoleOverviewData, RoleOverviewAdapter} from '../../../../../shared/adapters/role-overview.adapter';
import {FormControl} from '@angular/forms';
import {CustomGanttChartComponent} from '../../../../../chart/components/custom-gantt-chart/custom-gantt-chart.component';
import {ApiService} from '../../../../../shared/services/api.service';
import {GroupFacade} from '../../../../../store/facade/group.facade';
import {GroupsettingsService} from '../../../../../shared/services/groupsettings.service';

@Component({
  selector: 'app-role-overview',
  templateUrl: './role-overview.component.html',
  styleUrls: ['./role-overview.component.scss']
})
export class RoleOverviewComponent extends WidgetComponent implements OnInit {
  public static WIDGET_CLASS_NAME =  'RoleOverviewComponent';

  @ViewChild(CustomGanttChartComponent) chart: CustomGanttChartComponent | undefined;

  selectedRoles: FormControl<string[]> = new FormControl([]);
  roles: Role[] = [];

  datasets = [];
  labels = [];

  constructor(
    protected widgetTypeService: WidgetTypeService,
    protected roleOverviewAdapter: RoleOverviewAdapter,
    private groupSettingsService: GroupsettingsService,
  ) {
    super(widgetTypeService, RoleOverviewComponent);
  }

  getSelectData(rawData: RawRoleOverviewData[], filter: string[]) {
    return {
      roles: rawData.map((o): Role => ({viewValue: o.role, roleType: o.roleType})).sort((a, b) => a.viewValue.localeCompare(b.viewValue)),
      selectedRoles: rawData
        .filter(value => filter.find(roleType => roleType === value.roleType))
        .map((o) => o.roleType)
    };
  }

  updateChartFilters() {
    const adaptedData = this.roleOverviewAdapter.adapt(this.chartData.data, this.selectedRoles.value);
    this.chart.updateChart(adaptedData.datasets, adaptedData.labels);
    this.groupSettingsService.postRoleOverviewFilter(this.selectedRoles.value);
  }

  ngOnInit(): void {
    const selectData = this.getSelectData(this.chartData.data, this.chartData.filter);
    this.selectedRoles.setValue(selectData.selectedRoles);
    this.roles = selectData.roles;
    const adaptedData = this.roleOverviewAdapter.adapt(this.chartData.data, this.chartData.filter);
    this.datasets = adaptedData.datasets;
    this.labels = adaptedData.labels;
  }
}

interface Role{
  viewValue: string;
  roleType: string;
}
