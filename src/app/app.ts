import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  host: {
    class: 'block min-h-screen'
  },
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {}
