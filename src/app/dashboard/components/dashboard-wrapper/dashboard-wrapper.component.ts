import { Component, OnInit } from '@angular/core';
import {BreadcrumbService} from '../../../shared/services/breadcrumb.service';
import {TranslateService} from '@ngx-translate/core';

const exampleData: RawRoleOverviewData[] = [
  {
    role: 'AL',
    colors: ['#800', '#600'],
    data: [
      {
        name: 'Duplo',
        from: '2013-01-01',
        to: '2016-01-01'
      },
      {
        name: 'Lego',
        from: '2014-03-01',
        to: '2016-05-01'
      },
      {
        name: 'Pokemon',
        from: '2016-01-01',
        to: '2018-02-01'
      },
      {
        name: 'Frodo',
        from: '2017-02-01',
        to: '2022-01-01'
      },
      {
        name: 'Nutella',
        from: '2018-02-01',
        to: '2020-01-01'
      },
      {
        name: 'Kasta',
        from: '2020-01-01',
        to: '2022-01-01'
      }
    ]
  },
  {
    role: 'Coach',
    colors: ['#080', '#060'],
    data: [
      {
        name: 'Example',
        from: '2013-01-01',
        to: '2022-01-01'
      },
    ]
  },
  {
    role: 'ER',
    colors: ['#008', '#006'],
    data: [
      {
        name: 'Example',
        from: '2013-01-01',
        to: '2022-01-01'
      },
    ]
  }
];

interface RawRoleOverviewData {
  role: string;
  colors: string[];
  data: PersonRoleInstance[];
}
interface PersonRoleInstance {
  name: string;
  from: string;
  to: string;
}

interface Previous {
  name: string;
  from: Date;
  to: Date;
}

/**
 *  The data we get is a onedimensional array for each role containing the times during which a person had a role.
 *  Multiple people can have the same role at the same time. To display that on the chart we need to distribute them accross multiple rows.
 *  You can think of it this way:
 *  +------+------------------------------------------------+
 *  | Role | [Person one.......][Person three............]  | Row one
 *  |      |       [Person two.............................]| Row two
 *  +------+------------------------------------------------+
 *  Each of those rows is an independent array.
 *  The following function transforms the array we get from the API into the corresponding data structure the graph needs.
 */
const transformData = (rawData: RawRoleOverviewData[]) => {
  const labels = rawData.map(el => el.role);
  const datasets = rawData.reduce((previousValue, currentValue) => {
    // Splits the data for one role into the arrays for each row.
    const formattedRoleData = currentValue.data.reduce((adder, rawOccupation, currentIndex) => {
      const convertedDataObject = {
        y: currentValue.role,
        duration: [rawOccupation.from, rawOccupation.to],
        label: rawOccupation.name,
        color: currentValue.colors[0]
      };
      for (const [index, row] of adder.entries()) {
        // Check if the occupation fits on this row
        if (new Date(row[row.length - 1].duration[1]) <= new Date(rawOccupation.from)) {
          convertedDataObject.color = currentValue.colors[row.length % 2];
          adder[index].push(convertedDataObject);
          return adder;
        }
      }
      adder.push([convertedDataObject]);
      return adder;
    }, [] as Data[][]);

    // Add rows of this role to the accumulator
    formattedRoleData.forEach((value, index) => {
      if (!previousValue[index]) {
        previousValue.push({
          data: value
        });
      } else {
        previousValue[index].data.push(...value);
      }
    });
    return previousValue;
  }, [] as Dataset[]);
  return {
    datasets,
    labels
  };
};
@Component({
  selector: 'app-dashboard-wrapper',
  templateUrl: './dashboard-wrapper.component.html',
  styleUrls: ['./dashboard-wrapper.component.scss']
})
export class DashboardWrapperComponent {

  datasets;
  labels;


  constructor() {
    const transformedData = transformData(exampleData);
    this.datasets = transformedData.datasets;
    this.labels = transformedData.labels;
  }
}

interface Data {
  y: string;
  duration: string[];
  label?: string;
  color: string;
}

interface Dataset {
  data: Data[];
}


/**
 * [
 *     {
 *       data: [{y: '2006', duration: ['2022-01-10', '2022-01-12']}],
 *     },
 *   ];
 */
