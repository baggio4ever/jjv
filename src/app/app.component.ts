import { Component,AfterViewInit,AfterViewChecked } from '@angular/core';
import { Cip4Service,JDF,JdfTag } from './cip4.service';
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
  filename = '';
  cy = null;
  jdf:JDF = null;
  selectedGuid = '';

  displayedColumns2 = ['id', /*'class',*/ 'blockType', 'blockName', 'blockSize', 'blockTrf'];
  displayedColumns3 = ['to', 'from', 'travel', 'travel_mm'];

  constructor(private cip4: Cip4Service) {}

  ngAfterViewInit() {
    //    console.log('AfterViewInit');
      }
    
      ngAfterViewChecked() {
    //    console.log('AfterViewChecked');
      }
    
  onChanged(filename) {
    this.filename = filename;
    console.log('onChanged: '+filename);

    this.fileSelected = (this.filename !== '');
  }

  yes(fileVal) {
//    const file = fileVal;
//    const fileName: string = fileVal.name;

//    console.log('fileName: '+fileName);

    this.letsLoad(fileVal);
//    this.cip4.parseJDF(file);
  }

  async letsLoad( f ) {
    if (this.cip4.isJDF(f.name)) {
      this.jdf = await this.cip4.parseJDF(f);
      console.log(this.jdf);
      
      this.fileLoaded = true;
      setTimeout(() => { // チョイ待たせてCytoscape
//        this.doLayout();
        this.initCytoscape();
        this.makeGraph();
        this.doHighlight();
      }, 0);
    } else {
      console.log('JDFファイルにしてくださいよ');
    }
  }

  clear(): void {
    this.fileLoaded = false;
    this.filename = '';
    this.jdf = null;
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

  initCytoscape(): void {
    this.cy = Cytoscape({
      container: document.getElementById('cy'), // container to render in

      elements: [
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
            'background-color': '#722',
            'label': 'data(tag_id)',
            'shape': 'ellipse'
          }
        },
        {
          selector: ':selected.process',
          style: {
            'background-color': '#c22',
            'label': 'data(tag_id)',
            'shape': 'ellipse',
            'border-width': '2',
            'border-color': 'black',
          }
        },
        {
          selector: '.component',
          style: {
            'background-color': '#777',
            'label': 'data(tag_id)',
            'shape': 'rectangle'
          }
        },
        {
          selector: ':selected.component',
          style: {
            'background-color': '#eee',
            'label': 'data(tag_id)',
            'shape': 'rectangle',
            'border-width': '2',
            'border-color': 'black',
          }
        },
        {
          selector: '.params',
          style: {
            'background-color': '#850',
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
          selector: ':selected.params',
          style: {
            'background-color': '#ea0',
            'label': 'data(tag_id)',
            'border-width': '2',
            'border-color': 'black',
          }
        },
        {
          selector: '.device',
          style: {
            'background-color': '#262',
            'label': 'data(tag_id)',
            'shape': 'hexagon'
          }
        },
        {
          selector: ':selected.device',
          style: {
            'background-color': '#2c2',
            'border-width': '2',
            'border-color': 'black',
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#555',
            'target-arrow-color': '#555',
            'target-arrow-shape': 'triangle'
          }
        },
        {
          selector: '.uni-arrow',
          style: {
            'curve-style': 'bezier',
            'width': 3,
            'line-color': '#222',
            'arrow-scale': 1,
            'target-arrow-color': '#222',
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

    this.doLayout();
  }

  relayout(): void {
    this.doLayout();
  }

  doLayout(): void {
    // レイアウト
    const l = this.cy.layout({
      name: 'klay',
      klay: {
        spacing: 40, /* オブジェクト間の最小間隔 */
        direction: 'DOWN'
      }
    });
    l.run();
  }

  isSelected( guid: string ): boolean {
    return (this.selectedGuid === guid);
  }

  cardClicked(guid: string):void {
    console.log('cardClicked : '+guid);
    this.cy.$('node').unselect();
    const el = this.cy.getElementById(guid)
    if(el) {
      el.select();
    } else {
      console.log('見当たらねぇ : ' + guid);
    }
  }
}
