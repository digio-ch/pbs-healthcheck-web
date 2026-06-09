import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CustomGanttChartComponent } from '../../../../../chart/components/custom-gantt-chart/custom-gantt-chart.component';
import { Data, RawRoleOverviewData, RoleOverviewAdapter } from '../../../../../shared/adapters/role-overview.adapter';
import { GroupsettingsService } from '../../../../../shared/services/groupsettings.service';
import { WidgetTypeService } from '../../../services/widget-type.service';
import { WidgetComponent } from '../widget/widget.component';

@Component({
    selector: 'app-role-overview',
    templateUrl: './role-overview.component.html',
    styleUrls: ['./role-overview.component.scss'],
    standalone: false
})
export class RoleOverviewComponent extends WidgetComponent implements OnInit {
  public static WIDGET_CLASS_NAME =  'RoleOverviewComponent';

  @ViewChild(CustomGanttChartComponent) chart: CustomGanttChartComponent | undefined;

  selectedRoles: FormControl<string[]> = new FormControl([]);
  roles: Role[] = [];

  datasets: [{ data: Data[] }] = [{ data: [] }];
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
    this.datasets = adaptedData.datasets as [{ data: Data[] }];
    this.labels = adaptedData.labels;
  }
}

interface Role{
  viewValue: string;
  roleType: string;
}
