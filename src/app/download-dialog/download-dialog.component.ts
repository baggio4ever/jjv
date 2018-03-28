import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { MyHttpService, Fi } from '../my-http.service';

@Component({
  selector: 'app-download-dialog',
  templateUrl: './download-dialog.component.html',
  styleUrls: ['./download-dialog.component.css']
})
export class DownloadDialogComponent implements OnInit {
  searching = false;
  files = [];
  selectedItem = null;

  constructor( private httpService: MyHttpService, public dialogRef: MatDialogRef<DownloadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
/*
  onSelect(f): void {
    this.selectedItem = f;
  }
*/
  onCardSelect(f): void {
    this.selectedItem = f;
  }

  onSearch(): void {
    this.searching = true;
    this.files = [];
    this.selectedItem = null;

    console.log('onSearch() start.');
    this.httpService.getFiles(this.data.user_id, (files) => {
      this.searching = false;
      console.log('onSearch() finished.');
      console.log('   files.length: ' + files.length);
      this.files = files;
    });
  }

  getResult() {
    return {
      user_id: this.data.user_id,
      f: this.selectedItem
    }
  }

  copyUrl(input): void {
    input.select();
    document.execCommand('copy');
  }

  getSelectedItemUrl(): string {
    const base_url = location.protocol + '//' + location.host + location.pathname;
    const params: HttpParams = new HttpParams().set('user_id', this.selectedItem.user_id ).set('created_at', this.selectedItem.created_at);

    const url = base_url + '?' + params.toString();

    console.log(url);
    
    return url;
  }
}
