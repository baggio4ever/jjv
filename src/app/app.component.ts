import { Component,AfterViewInit,AfterViewChecked } from '@angular/core';
import { Cip4Service,JDF } from './cip4.service';
import * as Cytoscape from 'cytoscape';
import * as klay from 'cytoscape-klay';
import { Guid } from "guid-typescript";

Cytoscape.use(klay);

declare var hljs: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit,AfterViewChecked {
  fileLoaded = false;
  fileSelected = false;
  cy = null;
  jdf:JDF = null;
  selectedGuid = '';

  constructor(private cip4: Cip4Service) {}

  ngAfterViewInit() {
    //    console.log('AfterViewInit');
        this.cy = Cytoscape({
          container: document.getElementById('cy'), // container to render in
    
          elements: [ // list of graph elements to start with
            { // node a
              data: { id: 'a' }
            },
            { // node b
              data: { id: 'b' }
            },
            { // edge ab
              data: { id: 'ab', source: 'a', target: 'b' }
            }
          ],
    
          style: [ // the stylesheet for the graph
            {
              selector: 'node',
              style: {
                'background-color': '#666',
                'label': 'data(id)',
                'font-size': 13
              }
            },
            {
              selector: '.process',
              style: {
                'background-color': '#666',
                'label': 'data(tag_id)'
              }
            },
            {
              selector: '.component',
              style: {
                'background-color': '#666',
                'label': 'data(tag_id)',
                'shape': 'rectangle'
              }
            },
            {
              selector: '.params',
              style: {
                'background-color': '#666',
                'label': 'data(tag_id)',
                'shape': 'tag',
    /*            'background-opacity': 0,
                'background-image': '../../assets/images/ic_sd_card_black_24dp_2x.png',
                'background-clip': 'none',
                'background-fit': 'contain'
              */
              }
            },
            {
              selector: '.device',
              style: {
                'background-color': '#666',
                'label': 'data(tag_id)',
                'shape': 'roundrectangle'
              }
            },
            {
              selector: ':selected',
              style: {
                'border-width': '2',
                'border-color': 'black',
                'background-color': '#b22',
              }
            },
            {
              selector: 'edge',
              style: {
                'width': 3,
                'line-color': '#ccc',
                'target-arrow-color': '#ccc',
                'target-arrow-shape': 'triangle'
              }
            },
            {
              selector: '.uni-arrow',
              style: {
                'curve-style': 'bezier',
                'width': 2,
                'line-color': '#999',
    //            'arrow-scale': 3,
                'target-arrow-color': '#999',
                'target-arrow-shape': 'triangle',
    //            'target-endpoint': 'outside-to-node',
    //            'source-arrow-color': '#088',
    //            'source-arrow-shape': 'triangle',
                'source-label': 'data(amount)',
                'source-text-offset': 15,
                'source-text-margin-y': -10,
                'font-size': 11
              }
            }
          ],
    
          layout: {
            name: 'grid',
            rows: 1
          }
    
        });
      }
    
      ngAfterViewChecked() {
    //    console.log('AfterViewChecked');
      }
    
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
    if (this.cip4.isJDF(f.name)) {
      this.jdf = await this.cip4.parseJDF(f);
      console.log(this.jdf);
      this.makeGraph();
    } else {
      console.log('JDFファイルにしてくださいよ');
    }
  }

  doHighlight(): void {
    const codes = document.getElementsByTagName('code');
    console.log('codes.length: ' + codes.length);
    for ( let i = 0; i < codes.length; i ++ ) {
      const co = codes[i];
      hljs.highlightBlock(co);
    }
  }

  scrollTo( tagName: string ): void {
    try {
      console.log('tagName: ' + tagName);
      document.getElementById(tagName).scrollIntoView( {behavior: 'smooth', block: 'center', inline: 'center'});
    } catch (e) {
      console.log('error!:' + e);
    }
  }

  makeGraph(): void {
    // 全削除のつもり
    this.cy.remove('node');

    // イベント
    this.cy.on('tap','node',(evt) => {
      const target = evt.target;
      const tag_id = target.data('tag_id');
      console.log('tapped: ' + tag_id);
      if (tag_id) {
//        target.select();
        this.scrollTo(tag_id);
      }
    });
    this.cy.on('select','node',(evt) => {
      const target = evt.target;
      const id = target.id();
      console.log('select: ' + id);
      if (id) {
        this.selectedGuid = id;
//        target.select();
//        this.scrollTo(tag_id);
      }
    });
    this.cy.on('unselect','node',(evt) => {
      const target = evt.target;
      const id = target.id();
      console.log('unselect: ' + id);
      this.selectedGuid = '';

      if (id) {
//        target.select();
//        this.scrollTo(tag_id);
      }
    });
/*
    this.cy.on('tap','.process',(evt) => {
      const target = evt.target;
      console.log('tapped: '+target.data('tag_id');
    });
*/
    // componentノード作成
    this.jdf.componentTags.forEach( (v,i,a) => {
      this.cy.add([
        {
          data: {
            id: v.guid,
            tag_id: v.id
          }
        }
      ]).addClass('component');
    });

    // processノード作成
    this.jdf.processTags.forEach( (v,i,a) => {
      this.cy.add([
        {
          data: {
            id: v.guid,
            tag_id: v.id
          }
        }
      ]).addClass('process');
    });

    // deviceノード作成
    this.jdf.deviceTags.forEach( (v,i,a) => {
      this.cy.add([
        {
          data: {
            id: v.guid,
            tag_id: v.id
          }
        }
      ]).addClass('device');
    });

    // StitchingParamsノード作成
    this.jdf.stitchingParamsTags.forEach( (v,i,a) => {
      this.cy.add([
        {
          data: {
            id: v.guid,
            tag_id: v.id
          }
        }
      ]).addClass('params');
    });

    // TrimmingParamsノード作成
    this.jdf.trimmingParamsTags.forEach( (v,i,a) => {
      this.cy.add([
        {
          data: {
            id: v.guid,
            tag_id: v.id
          }
        }
      ]).addClass('params');
    });

    // FoldingParamsノード作成
    this.jdf.foldingParamsTags.forEach( (v,i,a) => {
      this.cy.add([
        {
          data: {
            id: v.guid,
            tag_id: v.id
          }
        }
      ]).addClass('params');
    });

    // CuttingParamsノード作成
    this.jdf.cuttingParamsTags.forEach( (v,i,a) => {
      this.cy.add([
        {
          data: {
            id: v.guid,
            tag_id: v.id
          }
        }
      ]).addClass('params');
    });

    // CoverApplicationParamsノード作成
    this.jdf.coverApplicationParamsTags.forEach( (v,i,a) => {
      this.cy.add([
        {
          data: {
            id: v.guid,
            tag_id: v.id
          }
        }
      ]).addClass('params');
    });

    // SpinePreparationParamsノード作成
    this.jdf.spinePreparationParamsTags.forEach( (v,i,a) => {
      this.cy.add([
        {
          data: {
            id: v.guid,
            tag_id: v.id
          }
        }
      ]).addClass('params');
    });

    // StackingParamsノード作成
    this.jdf.stackingParamsTags.forEach( (v,i,a) => {
      this.cy.add([
        {
          data: {
            id: v.guid,
            tag_id: v.id
          }
        }
      ]).addClass('params');
    });

    this.jdf.processTags.forEach((v,i,a) => {
      // process - component（入力）エッジ
      v.inputComponentLinks.forEach((d,idx,ar) => {
        const aGuid = Guid.create().toString();
        const component = this.jdf.getComponentTagById(d.rRef);
        if( component ) {
          this.cy.add([
            { // edge 
              data: { id: aGuid, source: component.guid, target: v.guid, amount: d.amount  }
            },
          ]).addClass('uni-arrow');
        }
      });
      // process - component（出力）エッジ
      v.outputComponentLinks.forEach((d,idx,ar) => {
        const aGuid = Guid.create().toString();
        const component = this.jdf.getComponentTagById(d.rRef);
        if( component ) {
          this.cy.add([
            { // edge 
              data: { id: aGuid, source: v.guid, target: component.guid, amount: d.amount  }
            },
          ]).addClass('uni-arrow');
        }
      });

      // process - deviceエッジ
      v.deviceLinks.forEach((d,idx,ar) => {
        const aGuid = Guid.create().toString();
        const device = this.jdf.getDeviceTagById(d.rRef);
        if( device ) {
          this.cy.add([
            { // edge 
              data: { id: aGuid, source: v.guid, target: device.guid  }
            },
          ]);
        }
      });

      // process - paramsエッジ
      v.paramsLinks.forEach((d,idx,ar) => {
        const aGuid = Guid.create().toString();
        const params = this.jdf.getParamsTagById(d.rRef);
        if( params ) {
          this.cy.add([
            { // edge
              data: { id: aGuid, source: v.guid, target: params.guid  }
            },
          ]);
        } else {
          console.log('getParamsTagById ないす: '　+ d.rRef);
        }
      });
    });

    // レイアウト
    const l = this.cy.layout({
      name: 'klay',
      klay: {
        spacing: 40 /* オブジェクト間の最小間隔 */
      }
    });
    l.run();
//    this.cy.fit();
  }

  
}
