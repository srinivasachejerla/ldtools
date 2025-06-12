import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'create-feature-flag',
        loadComponent: () => import('./create-flag/create-flag.component')
      },
      {
        path: 'flag-status/:flagKey',
        loadComponent: () => import('./flag-status/flag-status.component')
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UiBasicRoutingModule {}
