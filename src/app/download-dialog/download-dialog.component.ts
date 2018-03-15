import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { MyHttpService } from '../my-http.service';

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

  onSelect(f): void {
    this.selectedItem = f;
  }

  onSearch(): void {
    this.searching = true;
    this.files = [];

    console.log('onSearch() start.');
    this.httpService.getFiles(this.data.user_id, (files) => {
      this.searching = false;
      console.log('onSearch() finished.');
      console.log('   files.length: ' + files.length);
      this.files = files;
    });
  }

}
