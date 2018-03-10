import { Component } from '@angular/core';
import { Cip4Service } from './cip4.service';
import * as Cytoscape from 'cytoscape';
import * as klay from 'cytoscape-klay';

Cytoscape.use(klay);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'jjv';
  fileLoaded = false;
  fileSelected = false;

  constructor(private cip4: Cip4Service) {}
/*
  clicked(): void {
    console.log('Clickされた！');
  }
  clicked2(): void {
    console.log('Click2された！');
  }
*/
  onChanged(filename) {
    console.log('onChanged: '+filename);

    this.fileSelected = (filename !== '');
  }

  yes(fileVal) {
    const file = fileVal;
    const fileName: string = fileVal.name;

    console.log('fileName: '+fileName);

    this.letsLoad(file);
//    this.cip4.parseJDF(file);
  }

  async letsLoad( f ) {
    let ret = await this.cip4.parseJDF(f);
    console.log(ret);
  }
}
