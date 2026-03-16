import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavGroup } from '../models';
import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';

@Component({
  selector: 'app-layout',
  standalone: true,
  host: {
    class: 'contents'
  },
  imports: [Sidebar, Topbar, RouterOutlet],
  templateUrl: './layout.html',
})
export class Layout {
  readonly navGroups: NavGroup[] = [
    {
      heading: 'Dashboards',
      items: [
        { label: 'Overview', icon: 'overview', route: '/overview' },
        { label: 'Groups', icon: 'groups', route: '/groups' },
        { label: 'Services', icon: 'servers', route: '/services' },
      ],
    },
    {
      heading: 'Configuration',
      items: [
        { label: 'Templates', icon: 'templates', route: '/templates' },
        { label: 'Accounts', icon: 'accounts', route: '/accounts' },
        { label: 'Monitoring', icon: 'monitoring', route: '/monitoring' },
      ],
    },
  ];

  readonly today = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date());
}
