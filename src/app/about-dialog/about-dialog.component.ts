import { Component, OnInit, Inject, VERSION } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { MyHttpService } from '../my-http.service';

@Component({
  selector: 'app-about-dialog',
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.css']
})
export class AboutDialogComponent implements OnInit {

  angular_version = VERSION;

  server_name: string;
  server_version: string;

  constructor( private httpService: MyHttpService,
    public dialogRef: MatDialogRef<AboutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.httpService.getMessage( (name,version,input) => {
      this.server_name = name;
      this.server_version = version;
    })
  }

}
