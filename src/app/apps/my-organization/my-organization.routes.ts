import { Routes } from "@angular/router";

export const MY_ORGANIZATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import("./pages/my-organization-page/my-organization-page.component")
        .then(m => m.MyOrganizationPageComponent),
  }
];