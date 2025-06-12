import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'badges',
        loadComponent: () => import('./basic-badge/basic-badge.component')
      },
      {
        path: 'create-feature-flag',
        loadComponent: () => import('./create-flag/create-flag.component')
      },
      {
        path: 'flag-status',
        loadComponent: () => import('./flag-status/flag-status.component')
      },
      {
        path: 'manage-targets',
        loadComponent: () => import('./manage-targets/manage-targets.component')
      },
      {
        path: 'tabs-pills',
        loadComponent: () => import('./basic-tabs-pills/basic-tabs-pills.component')
      },
      // {
      //   path: 'typography',
      //   loadComponent: () => import('./basic-typography/basic-typography.component')
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LaunchDarklyRoutingModule {}
