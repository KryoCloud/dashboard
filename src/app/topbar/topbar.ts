import { Component, input } from '@angular/core';

@Component({
  selector: 'app-kc-topbar',
  host: {
    class: 'contents'
  },
  standalone: true,
  templateUrl: './topbar.html',
})
export class Topbar {
  readonly section = input('General');
  readonly page    = input('Overview');
  readonly date    = input('18 Dec 2024');
}
