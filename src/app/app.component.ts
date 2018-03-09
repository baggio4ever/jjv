import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'jjv';
  fileLoaded = false;

  constructor() {}

  clicked(): void {
    console.log('Clickされた！');
  }
  clicked2(): void {
    console.log('Click2された！');
  }
}
