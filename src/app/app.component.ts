import { Component, OnInit, AfterViewInit, AfterViewChecked, Inject, Sanitizer } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {Router, ActivatedRoute, Params} from '@angular/router';

import { Cip4Service, JDF, JdfTag, IdHavingTag } from './cip4.service';
import * as Cytoscape from 'cytoscape';
import * as klay from 'cytoscape-klay';
import { Guid } from 'guid-typescript';
import { MyHttpService, Fi } from './my-http.service';
import { AppSettingsDialogComponent } from './app-settings-dialog.component';
import { AboutDialogComponent } from './about-dialog/about-dialog.component';
import { UploadDialogComponent } from './upload-dialog/upload-dialog.component';
import { DownloadDialogComponent } from './download-dialog/download-dialog.component';
import { MessageDialogComponent, MessageDialogButtons } from './message-dialog/message-dialog.component';

Cytoscape.use(klay);

declare var hljs: any;



const JJV_VERSION = '0.1.20';



const KEY_BASE_URL = 'KEY_BASE_URL';
const KEY_USER_ID = 'KEY_USER_ID';
const KEY_COMMENT = 'KEY_COMMENT';
const KEY_SEARCH_USER_ID = 'KEY_SEARCH_USER_ID';
const KEY_SMOOTH_SCROLL = 'KEY_SMOOTH_SCROLL';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, AfterViewChecked, OnInit {
  fileLoaded = false;
  filename = '';
  cy = null;  // Cytoscape
  jdf: JDF = null;
  selectedGuid = '';

  displayedColumns_cut = ['id', /*'class', 'blockType',*/ 'blockName', 'blockSize', 'blockTrf', 'blockSize_mm', 'blockTrf_mm'];
  displayedColumns_fold = ['to', 'from', 'travel', 'travel_mm'];

//  ret_from_http = '';
//  ret_from_http_input = '';

  ret_from_post = '';

  param_user_id = '';
  param_created_at = '';

  errorHtml = null;

  smoothScroll = true;

  TITLE_ALL_ATTRIBS = '属性（sorted）';
  TITLE_PART_OF_JDF = 'JDF該当箇所';

  constructor(private activatedRoute: ActivatedRoute, private sanitizer: DomSanitizer, 
    private cip4: Cip4Service, private httpService: MyHttpService,
     public dialog: MatDialog, public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    console.log('ngOnInit()');
  }

  ngAfterViewInit() {
    console.log('ngViewInit()');

    const base_url = localStorage.getItem(KEY_BASE_URL);
    this.httpService.setBaseURL(base_url);

    this.smoothScroll = (localStorage.getItem(KEY_SMOOTH_SCROLL)==='0')?false:true;

    this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.param_user_id = params['user_id'];
        this.param_created_at = params['created_at'];

        console.log('  user_id: ' + this.param_user_id);
        console.log('  created_at: ' + this.param_created_at);

        if (this.param_user_id && this.param_created_at) {
          this.httpService.downloadXml(this.param_user_id, this.param_created_at, result => {
            if (result) {
              this.loadJDFfromString(result);

              console.log('testDownload(): ' + result );
              this.snackBar.open('download', '成功', {
                duration: 2000,
              });
            } else {
              console.log('testDownload(): ' + result );
              this.snackBar.open('download', '失敗', {
                duration: 2000,
              });
            }
          });
        }
    });

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
    console.log('onChanged: ' + fileVal.name);

    this.letsLoad(fileVal);
//    this.yes(fileVal);
  }

//  yes(fileVal) {
//    this.letsLoad(fileVal);
//  }

  async letsLoad( f ) {
//    this.parseErrorMessages = [];
//    this.errorHtml = null;
//    this.safeErrorHtml = null;
    this.clear();

    if (this.cip4.isJDF(f.name)) {
      if ( this.jdf = await this.cip4.parseJDF(f) ) {
        console.log(this.jdf);

        this.fileLoaded = true;
        this.filename = f.name;
        this.updateTitle();

        setTimeout(() => { // チョイ待たせてCytoscape
          this.initCytoscape();
          this.makeGraph();
          this.doHighlight();
        }, 0);
      } else {
        console.log('parseJDF() 失敗！');
//        console.log(this.cip4.parserErrorMessage);
//        this.parseErrorMessages = this.cip4.parserErrorMessages;
        this.errorHtml = this.cip4.errorHtml;
        this.errorHtml = this.errorHtml.replace('\n', '<br>');
//        this.safeErrorHtml = this.sanitizer.bypassSecurityTrustHtml(this.errorHtml);

        // valueをクリアしないと、同一ファイルを選択し直しても onchangeが呼ばれない
        const el = <HTMLInputElement>document.getElementById('input-file-id');
        el.value = '';
      }
    } else {
      console.log('JDFファイルにしてくださいよ');
    }
  }

  clear(): void {
    this.fileLoaded = false;
    this.filename = '';
    this.jdf = null;

    this.errorHtml = null;

    this.updateTitle();
  }

  doHighlight(): void {
    const codes = document.getElementsByTagName('code');
    console.log('codes.length: ' + codes.length);
    for ( let i = 0; i < codes.length; i ++ ) {
      const co = codes[i];
      hljs.highlightBlock(co);
    }
  }

  updateTitle(): void {
    if( this.fileLoaded ) {
      document.title = 'jjv - ' + this.filename;
    } else {
      document.title = 'jjv';
    }
  }

  scrollTo( guid: string ): void {
    try {
      console.log('tagName: ' + guid);

      const option_behavior = this.smoothScroll ? 'smooth' : 'auto';
      document.getElementById(guid).scrollIntoView( {behavior: option_behavior/*'smooth'*/, block: 'center', inline: 'center'});
//      this.selectedGuid = guid;
    } catch (e) {
      console.log('error!:' + e);
    }
  }

  scrollAndSelectTo( ev: any, guid: string ): void {
    ev.stopPropagation();

//    console.log('--- in scrollAndSelectTo ' + guid);
    this.scrollTo(guid);
    this.cardClicked(guid);
//    console.log('--- out scrollAndSelectTo ' + guid);
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
            'label': 'data(node_label)',
            'shape': 'ellipse',
            'background-color': '#800',
            'border-width': 1,
            'border-color': 'black',
            'text-halign': 'right',
            'text-valign': 'center',
            'text-margin-x': 5,
            'text-margin-y': 5
          }
        },
        {
          selector: ':selected.process',
          style: {
            'label': 'data(node_label)',
            'shape': 'ellipse',
            'background-color': '#f00',
            'border-width': 2,
            'border-color': 'black',
          }
        },
        {
          selector: '.component',
          style: {
            'label': 'data(node_label)',
            'shape': 'rectangle',
            'background-color': '#888',
            'border-width': 1,
            'border-color': 'black',
            'text-valign': 'bottom',
            'text-margin-y': 5
          }
        },
        {
          selector: ':selected.component',
          style: {
            'label': 'data(node_label)',
            'shape': 'rectangle',
            'background-color': '#ffffef',
            'border-width': 2,
            'border-color': 'black',
          }
        },
        {
          selector: '.params',
          style: {
            'label': 'data(node_label)',
            'shape': 'tag',
            'background-color': '#960',
            'border-width': 1,
            'border-color': 'black',
/*            'background-opacity': 0,
            'background-image': '../../assets/images/ic_sd_card_black_24dp_2x.png',
            'background-clip': 'none',
            'background-fit': 'contain'
          */
            'text-valign': 'bottom',
            'text-margin-y': 5
          }
        },
        {
          selector: ':selected.params',
          style: {
            'label': 'data(node_label)',
            'background-color': '#fb0',
            'border-width': 2,
            'border-color': 'black',
          }
        },
        {
          selector: '.device',
          style: {
            'label': 'data(node_label)',
            'shape': 'hexagon',
            'background-color': '#383',
            'border-width': 1,
            'border-color': 'black',
            'text-valign': 'bottom',
            'text-margin-y': 5
          }
        },
        {
          selector: ':selected.device',
          style: {
            'background-color': '#3f3',
            'border-width': 2,
            'border-color': 'black',
          }
        },
        {
          selector: '.unknown',
          style: {
            'label': 'data(node_label)',
            'shape': 'tag',
            'background-color': '#af1964',
            'border-width': 1,
            'border-color': 'black',
/*            'background-opacity': 0,
            'background-image': '../../assets/images/ic_sd_card_black_24dp_2x.png',
            'background-clip': 'none',
            'background-fit': 'contain'
          */
            'text-valign': 'bottom',
            'text-margin-y': 5
          }
        },
        {
          selector: ':selected.unknown',
          style: {
            'label': 'data(node_label)',
            'background-color': '#ff69b4',
            'border-width': 2,
            'border-color': 'black',
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1,
            'line-color': '#555',
            'target-arrow-color': '#777',
            'target-arrow-shape': 'triangle'
          }
        },
        {
          selector: '.uni-arrow',
          style: {
            'curve-style': 'bezier',
            'width': 2,
            'line-color': '#777',
            'arrow-scale': 1,
            'target-arrow-color': '#777',
            'target-arrow-shape': 'triangle',
            'source-label': 'data(amount)',
            'source-text-offset': 25,
            'source-text-margin-x': 15,
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
      const id = target.id();
      console.log('tapped: ' + id);
      if (id) {
        this.scrollTo(id);
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
    });

    // componentノード作成
    this.jdf.componentTags.forEach( (v, i, a) => {
      this.cy.add([
        {
          data: {
            id: v.guid,
            jdf_id: v.id,
            node_label: v.getCaption()
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
            jdf_id: v.id,
            node_label: v.getCaption()
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
            jdf_id: v.id,
            node_label: v.getCaption()
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
            jdf_id: v.id,
            node_label: v.getCaption()
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
            jdf_id: v.id,
            node_label: v.getCaption()
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
            jdf_id: v.id,
            node_label: v.getCaption()
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
            jdf_id: v.id,
            node_label: v.getCaption()
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
            jdf_id: v.id,
            node_label: v.getCaption()
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
            jdf_id: v.id,
            node_label: v.getCaption()
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
            jdf_id: v.id,
            node_label: v.getCaption()
          }
        }
      ]).addClass('params');
    });

    // UnknownResourceノード作成
    this.jdf.unknownResourceTags.forEach( (v, i, a) => {
      this.cy.add([
        {
          data: {
            id: v.guid,
            jdf_id: v.id,
            node_label: v.getCaption()
          }
        }
      ]).addClass('unknown');
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
//              data: { id: aGuid, source: v.guid, target: params.guid  }
              data: { id: aGuid, source: params.guid, target: v.guid  }
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
//        this.yes(droppedFile);
          this.letsLoad(droppedFile);
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

  /*
  sayHello(): void {
    this.ret_from_http = '';
    this.ret_from_http_input = '';
    this.httpService.getMessage( (name, version, input) => {
      this.ret_from_http = name + ' ' + version;
      this.ret_from_http_input = input;

      this.snackBar.open('sayHello : ' + name + ' ' + version, '成功', {
        duration: 2000,
      });
    });
  }
  */
/*
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
*/
  openSettings(): void {
    console.log('openSettings()');

    const dialogRef = this.dialog.open(AppSettingsDialogComponent, {
      width: '480px',
      data: { 
        url: this.httpService.getBaseURL(),
        smoothScroll: this.smoothScroll
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('The dialog was closed: ');
        console.log('    ' + result.url);
        localStorage.setItem(KEY_BASE_URL, result.url);
        this.httpService.setBaseURL(result.url);

        console.log('    ' + result.smoothScroll);
        this.smoothScroll = result.smoothScroll;
        localStorage.setItem(KEY_SMOOTH_SCROLL, this.smoothScroll?'1':'0');
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
        localStorage.setItem(KEY_USER_ID, result.user_id);
        localStorage.setItem(KEY_COMMENT, result.comment);

        const now = new Date().toLocaleString();

        const body: Fi = {
          user_id: result.user_id,
          filename: result.filename,
          xml: this.jdf.beautifiedXml,
          comment: result.comment,
          upload_date: now
        };

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
  }
/*
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
*/
  loadJDFfromString(s: Fi) {
        this.jdf = this.cip4.parseJDFfromString(s.xml);
        console.log(this.jdf);

        this.fileLoaded = true;
        this.filename = s.filename;
        this.updateTitle();

        console.log('fromstring filename:' + this.filename);

        setTimeout(() => { // チョイ待たせてCytoscape
          this.initCytoscape();
          this.makeGraph();
          this.doHighlight();
        }, 0);
  }

  downloadFromCloud(): void {
      console.log('downloadToCloud()');

    const dialogRef = this.dialog.open(DownloadDialogComponent, {
      width: '620px',
//      height: '480px',
      data: {
        user_id: localStorage.getItem(KEY_SEARCH_USER_ID)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
/*
        console.log('The dialog was closed');
        console.log('    user_id: ' + result.user_id);
        console.log('    f:       ' + result.f.filename);
*/
        localStorage.setItem(KEY_SEARCH_USER_ID, result.user_id);

        this.loadJDFfromString(result.f);
/*
        this.jdf = this.cip4.parseJDFfromString(result.f.xml);
        console.log(this.jdf);

        this.fileLoaded = true;
        this.filename = result.f.filename;
        console.log('fromstring filename:' + this.filename);

        setTimeout(() => { // チョイ待たせてCytoscape
          this.initCytoscape();
          this.makeGraph();
          this.doHighlight();
        }, 0);
*/
      } else {
        console.log('キャンセルされました？');
      }
    });

  }

  saveToFile(): void {
    const content = this.jdf.beautifiedXml;
    const blob = new Blob([content], {'type': 'text/xml'});

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
      data: { jjv_version: JJV_VERSION }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('The dialog was closed: ' + result);
      } else {
        console.log('キャンセルされました？');
      }
    });
  }

  saveGraphAsPNG(): void {
    const base64uri = this.cy.png({ full: true, scale: 2 });

    document.getElementById('save-as-png').setAttribute('href', base64uri);
    document.getElementById('save-as-png').setAttribute('download', 'jjv.png');
    document.getElementById('save-as-png').click();
  }

  showMessageDialog(caption: string, message: string, buttons: MessageDialogButtons, callback: (result: boolean) => void ): void {

    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '400px',
      data: {
        caption: caption,
        message: message,
        buttons: buttons
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('The dialog was closed: ' + result);
        callback(true);
      } else {
        console.log('キャンセルされました？');
        callback(false);
      }
    });
  }

  getCardTitle( aTag: IdHavingTag ): string {
    if ( aTag ) {
        return aTag.getCaption();
    } else {
      return 'あちゃー';
    }
  }

  getCartSubtitle( aTag: IdHavingTag ): string {
    if( aTag ) {
      return aTag.id;    
    } else {
      return 'あちゃちゃー';
    }
  }
/*
  testDownload(): void {
        this.httpService.downloadXml('hira','masa', msg => {
          console.log('testDownload(): ' + msg );
          this.snackBar.open('download', '成功', {
            duration: 2000,
          });
        });
  }

  testGetUrl(): void {
    console.log('location.href: '+location.href);
    console.log('location.xxxx: '+location.protocol + '//' + location.host + location.pathname);
  }
  */
}


