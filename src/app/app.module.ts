import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

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

import { AppComponent, AppSettingsDialogComponent } from './app.component';

import { Cip4Service } from './cip4.service';
import { MyHttpService } from './my-http.service';

@NgModule({
  declarations: [
    AppComponent,
    AppSettingsDialogComponent
  ],
  entryComponents: [
    AppSettingsDialogComponent
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
    MatInputModule
  ],
  providers: [
    Cip4Service,
    MyHttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
