import { inject, Injectable, Signal } from "@angular/core";
import { Preview } from "../models/preview";
import { toSignal } from "@angular/core/rxjs-interop";
import { filter, startWith, switchMap } from "rxjs";
import { Group } from "src/app/shared/models/group";
import { GroupFacade } from "src/app/store/facade/group.facade";
import { MyOrganizationService } from "../services/my-organization.service";

@Injectable()
export class MyOrganizationPreviewStore {
  private service = inject(MyOrganizationService);
  private groups = inject(GroupFacade);

  /*
    NOTE: Although typescript tells us that groups.getCurrentGroup$ returns Group, it can also return null.
    This is because it is based on a BehaviouralSubject that is set to null initially, however the typing
    does not reflect that.
  */
  private data$ = this.groups.getCurrentGroup$().pipe(
    filter((group): group is Group => !!group),
    filter((group) => group.isAssociation()),
    switchMap((group) => 
      this.service.getPreview(group.id).pipe(
        startWith(null), // set null if the preview is reloading
      )
    )
  );

  readonly data: Signal<Preview | null> = toSignal(this.data$, { 
    initialValue: null 
  });
}
