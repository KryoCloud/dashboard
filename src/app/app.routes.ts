import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout').then((m) => m.Layout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        loadComponent: () => import('./pages/overview/overview').then((m) => m.Overview),
      },
      {
        path: 'groups',
        loadComponent: () => import('./pages/groups/groups').then((m) => m.Groups),
      },
      {
        path: 'services',
        loadComponent: () => import('./pages/servers/servers').then((m) => m.Services),
      },
      { path: 'servers', redirectTo: 'services', pathMatch: 'full' },
      {
        path: 'templates',
        loadComponent: () => import('./pages/templates/templates').then((m) => m.Templates),
      },
      {
        path: 'accounts',
        loadComponent: () => import('./pages/accounts/accounts').then((m) => m.Accounts),
      },
      {
        path: 'monitoring',
        loadComponent: () => import('./pages/monitoring/monitoring').then((m) => m.Monitoring),
      },
      { path: '**', redirectTo: 'overview' },
    ],
  },
];
