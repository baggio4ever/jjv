import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule, ActivatedRoute, Params} from '@angular/router';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDividerModule} from '@angular/material/divider';
import {MatSliderModule} from '@angular/material/slider';

import { AppComponent } from './app.component';
import { AppSettingsDialogComponent } from './app-settings-dialog.component';

import { Cip4Service } from './cip4.service';
import { MyHttpService } from './my-http.service';
import { AboutDialogComponent } from './about-dialog/about-dialog.component';
import { UploadDialogComponent } from './upload-dialog/upload-dialog.component';
import { DownloadDialogComponent } from './download-dialog/download-dialog.component';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';


const routes: Routes = [
  {
    path: '**',
    component: AppComponent,
  }
];

@NgModule({
  declarations: [
    AppComponent,
    AppSettingsDialogComponent,
    AboutDialogComponent,
    UploadDialogComponent,
    DownloadDialogComponent,
    MessageDialogComponent
  ],
  entryComponents: [
    AppSettingsDialogComponent,
    AboutDialogComponent,
    UploadDialogComponent,
    DownloadDialogComponent,
    MessageDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,  // HTTP通信モジュールをインポート
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatIconModule,
    MatExpansionModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatSliderModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    Cip4Service,
    MyHttpService,
//    ActivatedRoute
  ],
//  exports: [
//    RouterModule
//  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
