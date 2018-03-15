import { Component, AfterViewInit, AfterViewChecked, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';

import { Cip4Service, JDF, JdfTag } from './cip4.service';
import * as Cytoscape from 'cytoscape';
import * as klay from 'cytoscape-klay';
import { Guid } from 'guid-typescript';
import { MyHttpService } from './my-http.service';
import { AppSettingsDialogComponent } from './app-settings-dialog.component';
import { AboutDialogComponent } from './about-dialog/about-dialog.component';
import { UploadDialogComponent } from './upload-dialog/upload-dialog.component';
import { DownloadDialogComponent } from './download-dialog/download-dialog.component';

Cytoscape.use(klay);

declare var hljs: any;

const KEY_BASE_URL = 'KEY_BASE_URL';
const KEY_USER_ID = 'KEY_USER_ID';
const KEY_COMMENT = 'KEY_COMMENT';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, AfterViewChecked {
  fileLoaded = false;
//  fileSelected = false;
  filename = '';
  cy = null;  // Cytoscape
  jdf: JDF = null;
  selectedGuid = '';

  displayedColumns2 = ['id', /*'class',*/ 'blockType', 'blockName', 'blockSize', 'blockTrf'];
  displayedColumns3 = ['to', 'from', 'travel', 'travel_mm'];

  ret_from_http = '';
  ret_from_http_input = '';

  ret_from_post = '';

  constructor(private cip4: Cip4Service, private httpService: MyHttpService, public dialog: MatDialog, public snackBar: MatSnackBar) {
  }

  ngAfterViewInit() {
    const base_url = localStorage.getItem(KEY_BASE_URL);
    this.httpService.setBaseURL(base_url);

//    console.log('AfterViewInit');
/*
どうしたらFileドロップ許可領域以外をFileドロップ禁止にできるのか。
    document.addEventListener('ondrop',(ev)=>{
      console.log('XXXX');
      ev.stopPropagation();
      ev.preventDefault();
    });
    document.addEventListener('ondragover',(ev)=>{
      console.log('YYYY');
      ev.stopPropagation();
      ev.preventDefault();
    });
*/
   }

  ngAfterViewChecked() {
    //    console.log('AfterViewChecked');
  }

  onChanged(fileVal) {
    this.filename = fileVal.name;
    console.log('onChanged: ' + this.filename);

//    this.fileSelected = (this.filename !== '');

    this.yes(fileVal);
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
            'label': 'data(tag_id)',
            'shape': 'ellipse',
            'background-color': '#800',
            'border-width': '1',
            'border-color': 'black',
          }
        },
        {
          selector: ':selected.process',
          style: {
            'label': 'data(tag_id)',
            'shape': 'ellipse',
            'background-color': '#f00',
            'border-width': '2',
            'border-color': 'black',
          }
        },
        {
          selector: '.component',
          style: {
            'label': 'data(tag_id)',
            'shape': 'rectangle',
            'background-color': '#888',
            'border-width': '1',
            'border-color': 'black',
          }
        },
        {
          selector: ':selected.component',
          style: {
            'label': 'data(tag_id)',
            'shape': 'rectangle',
            'background-color': '#ffffef',
            'border-width': '2',
            'border-color': 'black',
          }
        },
        {
          selector: '.params',
          style: {
            'label': 'data(tag_id)',
            'shape': 'tag',
            'background-color': '#850',
            'border-width': '1',
            'border-color': 'black',
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
            'label': 'data(tag_id)',
            'background-color': '#fb0',
            'border-width': '2',
            'border-color': 'black',
          }
        },
        {
          selector: '.device',
          style: {
            'label': 'data(tag_id)',
            'shape': 'hexagon',
            'background-color': '#383',
            'border-width': '1',
            'border-color': 'black',
          }
        },
        {
          selector: ':selected.device',
          style: {
            'background-color': '#3f3',
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
    this.cy.on('tap', 'node', (evt) => {
      const target = evt.target;
      const tag_id = target.data('tag_id');
      console.log('tapped: ' + tag_id);
      if (tag_id) {
        this.scrollTo(tag_id);
      }
    });
    this.cy.on('select', 'node', (evt) => {
      const target = evt.target;
      const id = target.id();
      console.log('select: ' + id);
      if (id) {
        this.selectedGuid = id;
      }
    });
    this.cy.on('unselect', 'node', (evt) => {
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
    this.jdf.componentTags.forEach( (v, i, a) => {
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
    this.jdf.processTags.forEach( (v, i, a) => {
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
    this.jdf.deviceTags.forEach( (v, i, a) => {
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
    this.jdf.stitchingParamsTags.forEach( (v, i, a) => {
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
    this.jdf.trimmingParamsTags.forEach( (v, i, a) => {
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
    this.jdf.foldingParamsTags.forEach( (v, i, a) => {
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
    this.jdf.cuttingParamsTags.forEach( (v, i, a) => {
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
    this.jdf.coverApplicationParamsTags.forEach( (v, i, a) => {
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
    this.jdf.spinePreparationParamsTags.forEach( (v, i, a) => {
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
    this.jdf.stackingParamsTags.forEach( (v, i, a) => {
      this.cy.add([
        {
          data: {
            id: v.guid,
            tag_id: v.id
          }
        }
      ]).addClass('params');
    });

    this.jdf.processTags.forEach((v, i, a) => {
      // process - component（入力）エッジ
      v.inputComponentLinks.forEach((d, idx, ar) => {
        const aGuid = Guid.create().toString();
        const component = this.jdf.getComponentTagById(d.rRef);
        if ( component ) {
          this.cy.add([
            { // edge
              data: { id: aGuid, source: component.guid, target: v.guid, amount: d.amount  }
            },
          ]).addClass('uni-arrow');
        }
      });
      // process - component（出力）エッジ
      v.outputComponentLinks.forEach((d, idx, ar) => {
        const aGuid = Guid.create().toString();
        const component = this.jdf.getComponentTagById(d.rRef);
        if ( component ) {
          this.cy.add([
            { // edge
              data: { id: aGuid, source: v.guid, target: component.guid, amount: d.amount  }
            },
          ]).addClass('uni-arrow');
        }
      });

      // process - deviceエッジ
      v.deviceLinks.forEach((d, idx, ar) => {
        const aGuid = Guid.create().toString();
        const device = this.jdf.getDeviceTagById(d.rRef);
        if ( device ) {
          this.cy.add([
            { // edge
              data: { id: aGuid, source: v.guid, target: device.guid  }
            },
          ]);
        }
      });

      // process - paramsエッジ
      v.paramsLinks.forEach((d, idx, ar) => {
        const aGuid = Guid.create().toString();
        const params = this.jdf.getParamsTagById(d.rRef);
        if ( params ) {
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

  cardClicked(guid: string): void {
    console.log('cardClicked : ' + guid);
    this.cy.$('node').unselect();
    const el = this.cy.getElementById(guid);
    if (el) {
      el.select();
    } else {
      console.log('見当たらねぇ : ' + guid);
    }
  }

  dropHandler(ev: any) {
    console.log('DROP!!!');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    let droppedFile = null;

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === 'file') {
          const file = ev.dataTransfer.items[i].getAsFile();
          console.log('... file[' + i + '].name = ' + file.name);
          droppedFile = file;
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.files.length; i++) {
        console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
        droppedFile = ev.dataTransfer.files[i];
      }
    }

    // Pass event to removeDragData for cleanup
    this.removeDragData(ev);

    if (droppedFile) {
      if (this.cip4.isJDF(droppedFile.name)) {
        this.filename = droppedFile.name;
        this.yes(droppedFile);
      }
    }
  }

  dragOverHandler(ev: any) {
//    console.log('over');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  }

  removeDragData(ev: any) {
    console.log('Removing drag data');

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to remove the drag data
      ev.dataTransfer.items.clear();
    } else {
      // Use DataTransfer interface to remove the drag data
      ev.dataTransfer.clearData();
    }
  }

  sayHello(): void {
    this.ret_from_http = '';
    this.ret_from_http_input = '';
    this.httpService.getMessage( (msg, input) => {
      this.ret_from_http = msg;
      this.ret_from_http_input = input;

      this.snackBar.open('sayHello', '成功', {
        duration: 2000,
      });
    });
  }

  saveMessage(): void {
    const body = {
      user_id: 'jiro',
      message: '負けるな',
      comment: 'よいんじゃない？'
    };

    console.log('ログ書き込めぇ！');

    this.httpService.postMessage(body, msg => {
      this.ret_from_post = msg;
    });
  }

  openSettings(): void {
    console.log('openSettings()');

    const dialogRef = this.dialog.open(AppSettingsDialogComponent, {
      width: '400px',
      data: { url: this.httpService.getBaseURL() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('The dialog was closed: ' + result);
        localStorage.setItem(KEY_BASE_URL, result);
        this.httpService.setBaseURL(result);
        //      this.animal = result;
      } else {
        console.log('キャンセルされました？');
      }
    });
  }

  openFileDialog(): void {
    document.getElementById('input-file-id').click();
  }

  uploadToCloud(): void {
    console.log('uploadToCloud()');

    const dialogRef = this.dialog.open(UploadDialogComponent, {
      width: '400px',
      data: {
        user_id: localStorage.getItem(KEY_USER_ID),
        filename: this.filename,
        comment: localStorage.getItem(KEY_COMMENT)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('The dialog was closed: ' + result);
        console.log('      ' + result.user_id);
        console.log('      ' + result.filename);
        console.log('      ' + result.comment);

        localStorage.setItem(KEY_USER_ID, result.user_id);
        localStorage.setItem(KEY_COMMENT, result.comment);

        const body = {
          user_id: result.user_id,
          filename: result.filename,
          xml: this.jdf.beautifiedXml,
          comment: result.comment
        };

//        console.log('uploadToCloud() : ' + body);

        this.httpService.uploadXml(body, msg => {
          this.ret_from_post = msg;

          this.snackBar.open('upload', '成功', {
            duration: 2000,
          });
        });
      } else {
        console.log('キャンセルされました？');
      }
    });
/*
    const body = {
      user_id: 'michael',
      filename: this.filename,
      xml: this.jdf.beautifiedXml,
      comment: 'よいんじゃない？良いよね！？'
    };

    console.log('uploadToCloud() : ' + body);

    this.httpService.uploadXml(body, msg => {
      this.ret_from_post = msg;

      this.snackBar.open('upload', '成功', {
        duration: 2000,
      });
    });
  */
   }
/*
    saveMessage2(): void {
    const body = {
      user_id: 'sato',
      filename: 'ABC.txt',
      xml: '春はあけぼの',
      comment: 'よいんじゃない？'
    };

    console.log('uploadToCloud() : ' + body);

    this.httpService.uploadXml(body, msg => {
      this.ret_from_post = msg;
    });
  }
*/
  saveMessage3(): void {
    console.log('saveMessage3()');

    this.httpService.getFiles('hira', files => {
  //    this.ret_from_post = files;
      console.log('files.length: ' + files.length);
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        console.log('   ' + f.filename);
      }
    });
  }

  downloadFromCloud(): void {
      console.log('downloadToCloud()');

    const dialogRef = this.dialog.open(DownloadDialogComponent, {
      width: '400px',
      data: { url: 'テスト' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('The dialog was closed: ' + result);
//        localStorage.setItem(KEY_BASE_URL, result);
//        this.httpService.setBaseURL(result);
        //      this.animal = result;
      } else {
        console.log('キャンセルされました？');
      }
    });

  }

  saveToFile(): void {
    const content = this.jdf.beautifiedXml; // '春はあけぼの';
    const blob = new Blob([content],{'type':'text/xml'});

    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, 'test.jdf');

      // msSaveOrOpenBlobの場合はファイルを保存せずに開ける
      window.navigator.msSaveOrOpenBlob(blob, 'test.jdf');
    } else {
      document.getElementById('save-to-file').setAttribute('href', window.URL.createObjectURL(blob));
      document.getElementById('save-to-file').setAttribute('download', this.filename);
      document.getElementById('save-to-file').click();
    }
  }

  openAbout(): void {
    console.log('openAbout()');

    const dialogRef = this.dialog.open(AboutDialogComponent, {
      width: '400px',
      data: { url: 'dummy' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('The dialog was closed: ' + result);
        //      this.animal = result;
      } else {
        console.log('キャンセルされました？');
      }
    });
  }
}

/*
interface Fi {
  user_id: string;
  comment: string;
  filename: string;
  xml: string;
}
*/
/*
@Component({
  selector: 'app-settings-dialog',
  templateUrl: './app-settings-dialog.component.html',
  styleUrls: ['./app-settings-dialog.component.css']
})
export class AppSettingsDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AppSettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
*/