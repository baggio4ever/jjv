import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


@Injectable()
export class MyHttpService {

  base_url = '';

  constructor(private http: HttpClient) { }

  setBaseURL(url: string): void {
    this.base_url = url;
  }

  getBaseURL(): string {
    return this.base_url;
  }

  getMessage( callback: (name: string, version: string, input: string ) => void ): void {
    // API GatewayとHTTP通信して、取得成功時にコールバックを行う
    this.http.get( this.base_url + 'hello').subscribe(data => {
        callback(data['name'], data['version'], data['input']);
    });
  }
/*
  getLogsYMD( user_id: string, year: number, month: number, date: number, callback: (msg) => void): void {
    const y0 = ('0000' + year).slice(-4);
    const m0 = ('00' + month).slice(-2);
    const d0 = ('00' + date).slice(-2);
    // Parameters obj-
    const params: HttpParams = new HttpParams().set('user_id', user_id ).set('year', y0 ).set('month', m0 ).set('date', d0 );

    console.log(params.toString());

    this.http.get( this.base_url + 'logs', { params: params }).subscribe(data => {
        callback(data['logs']);
    });
  }

  getLogsYM( user_id: string, year: number, month: number, callback: (msg: string) => void): void {
    const y0 = ('0000' + year).slice(-4);
    const m0 = ('00' + month).slice(-2);
    // Parameters obj-
    const params: HttpParams = new HttpParams().set('user_id', user_id ).set('year', y0 ).set('month', m0 );

    console.log(params.toString());

    this.http.get( this.base_url + 'logs', { params: params }).subscribe(data => {
        callback(data['logs']);
    });
  }

  getLogsY( user_id: string, year: number, callback: (msg: string) => void): void {
    const y0 = ('0000' + year).slice(-4);
    // Parameters obj-
    const params: HttpParams = new HttpParams().set('user_id', user_id ).set('year', y0 );

    console.log(params.toString());

    this.http.get( this.base_url + 'logs', { params: params }).subscribe(data => {
        callback(data['logs']);
    });
  }

  postMessage( body, callback: (msg: string) => void ): void {
    // API GatewayとHTTP通信して、取得成功時にコールバックを行う
    this.http.post( this.base_url + 'log', body).subscribe(data => {
        callback(data['message']);
    });
  }
*/
  uploadXml( body, callback: (msg: string) => void ): void {
    // API GatewayとHTTP通信して、取得成功時にコールバックを行う
    this.http.post( this.base_url + 'upload', body).subscribe(data => {
        callback(data['message']);
    });
  }

  getFiles( user_id: string, callback: (files: Fi[]) => void): void {
    // Parameters obj-
    const params: HttpParams = new HttpParams().set('user_id', user_id );

    console.log(params.toString());

    this.http.get( this.base_url + 'files', { params: params }).subscribe(data => {
        callback(data['files'] as Fi[]);
    });
  }
}

export interface Fi {
  user_id: string;
  comment: string;
  filename: string;
  xml: string;
  upload_date: string;
}
