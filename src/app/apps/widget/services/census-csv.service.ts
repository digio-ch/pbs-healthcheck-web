import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CensusCsvService {
  private csvTranslationKeys;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private translateService: TranslateService
    ) {
    this.translateService.get('apps.census.csv').toPromise().then(next => {
      this.csvTranslationKeys = next;
    });
  }

  public downloadCsv(years: number[], chartData) {
    const filename = `${moment(new Date()).format('YYYY-MM-DD_hh-mm-ss')}_${this.csvTranslationKeys.census}.csv`;
    let fileContent = this.getCSVHeader(years);
    chartData.forEach(data => {
      fileContent += this.convertTableRowToCSVRow(data);
    });

    const aElement = document.createElement('a');
    aElement.setAttribute('download', filename);
    const href = URL.createObjectURL(new Blob([fileContent], {type: 'plain/csv'}));
    aElement.href = href;
    aElement.setAttribute('target', '_blank');
    aElement.click();
    URL.revokeObjectURL(href);
  }

  private getCSVHeader(years: number[]) {
    return `"${this.csvTranslationKeys.id}","${this.csvTranslationKeys.name}","${this.csvTranslationKeys.type}","${years.join('","')}","1J","3J","∅5J"\n`;
  }

  private convertTableRowToCSVRow(data) {
    const absoluteNumbers = data.absoluteMemberCounts.map(el => el || '-').join('","');
    const relativeNumbers = data.relativeMemberCounts.map(el => el === '-' ? el : `${el}%`).join('","');
    return `"${data.id}","${data.name}","${this.csvTranslationKeys[data.type]}","${absoluteNumbers}","${relativeNumbers}"\n`;
  }
}
