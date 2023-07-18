import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class RoleOverviewAdapter {
  /**
   *  The data we get is a onedimensional array for each role containing the times during which a person had a role.
   *  Multiple people can have the same role at the same time. To display that on the chart we need to distribute them accross multiple rows
   *  You can think of it this way:
   *  +------+------------------------------------------------+
   *  | Role | [Person one.......][Person three............]  | Row one
   *  |      |       [Person two.............................]| Row two
   *  +------+------------------------------------------------+
   *  Each of those rows is an independent array.
   *  The following function transforms the array we get from the API into the corresponding data structure the graph needs.
   */
  adapt(rawData: RawRoleOverviewData[], filter: string[]) {
    const filteredData = rawData
      .filter(value => filter.find(roleType => roleType === value.roleType));
    const labels = filteredData
      .map(el => el.role)
      .sort((a, b) => a.localeCompare(b));
    const datasets = filteredData
      .reduce((previousValue, currentValue) => {
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
  }
}

export interface RawRoleOverviewData {
  role: string;
  roleType: string;
  colors: string[];
  data: PersonRoleInstance[];
}
export interface PersonRoleInstance {
  name: string;
  from: string;
  to: string;
}

export interface Data {
  y: string;
  duration: string[];
  label?: string;
  color: string;
}

export interface Dataset {
  data: Data[];
}
