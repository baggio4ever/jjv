import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


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
