import { HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { QuapService } from "../services/quap.service";
import { firstValueFrom, Observable } from "rxjs";
import { NotificationService } from "src/app/shared/services/notification.service";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class QuapExportFacade {
  private quapService = inject(QuapService);
  private translateService = inject(TranslateService);
  private notificationService = inject(NotificationService);

  exportQuap(groupId: number, date: moment.Moment): void {
    this.handleExport(
      this.quapService.exportQuap(groupId, date)
    );
  }

  exportSharedQuap(groupId: number, subordinateGroupId: number, date: moment.Moment): void {
    this.handleExport(
      this.quapService.exportSharedQuap(groupId, subordinateGroupId, date)
    );
  }

  exportAllSharedQuaps(groupId: number, date: moment.Moment): void {
    this.handleExport(
      this.quapService.exportAllSharedQuaps(groupId, date),
      true,
    );
  }

  private async handleExport(result: Observable<HttpResponse<Blob>>, exportAllShared: boolean = false) {
    // avoid notification flickering on fast exports
    const loadingTimeout = setTimeout(() => {
      this.notify('loading', exportAllShared);
    }, 500);

    try {
      const response = await firstValueFrom(result);
      
      this.downloadFile(response, 'export.csv');
      this.notify('success', exportAllShared);
    } finally {
      clearTimeout(loadingTimeout);
    }
  }

  private notify(notification: 'loading' | 'success', shared: boolean) {
    const translationKey = shared
      ? `quap.export.shared.notification.${notification}`
      : `quap.export.notification.${notification}`; 

    const message = this.translateService.instant(translationKey);

    switch (notification) {
      case 'success':
        this.notificationService.success(message);
        break;
      case 'loading':
        this.notificationService.info(message);
       break;
    }
  }

  private downloadFile(res: HttpResponse<Blob>, fallbackName: string) {
    const blob = res.body!;
    
    let filename = this.getFilename(res.headers.get('Content-Disposition'));        

    if (!filename) {
      filename = fallbackName;
      console.error("failed to extract filename from headers", res.headers);
    }

    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
  }

  private getFilename(contentDisposition: string | null): string | undefined {
    if (!contentDisposition) {
      return undefined;
    }

    // RFC 5987 / RFC 6266
    const filenameStar = contentDisposition.match(/filename\*=([^']*)''([^;]+)/i);
    if (filenameStar) {
      return decodeURIComponent(filenameStar[2]);
    }

    const filename = contentDisposition.match(/filename="?([^";]+)"?/i);
    return filename?.[1];
  }
};