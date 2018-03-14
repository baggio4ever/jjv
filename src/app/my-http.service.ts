import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


const BASE_URL = 'https://yqc7o2rjld.execute-api.us-east-1.amazonaws.com/dev/';

@Injectable()
export class MyHttpService {

  constructor(private http: HttpClient) { }

  getMessage( callback: (msg: string, input: string ) => void ): void {
    // API GatewayとHTTP通信して、取得成功時にコールバックを行う
    this.http.get( BASE_URL + 'users/create').subscribe(data => {
        callback(data['message'], data['input']);
    });
  }

  getLogsYMD( user_id: string, year: number, month: number, date: number, callback: (msg) => void): void {
    const y0 = ('0000' + year).slice(-4);
    const m0 = ('00' + month).slice(-2);
    const d0 = ('00' + date).slice(-2);
    // Parameters obj-
    const params: HttpParams = new HttpParams().set('user_id', user_id ).set('year', y0 ).set('month', m0 ).set('date', d0 );

    console.log(params.toString());

    this.http.get( BASE_URL + 'logs', { params: params }).subscribe(data => {
        callback(data['logs']);
    });
  }

  getLogsYM( user_id: string, year: number, month: number, callback: (msg: string) => void): void {
    const y0 = ('0000' + year).slice(-4);
    const m0 = ('00' + month).slice(-2);
    // Parameters obj-
    const params: HttpParams = new HttpParams().set('user_id', user_id ).set('year', y0 ).set('month', m0 );

    console.log(params.toString());

    this.http.get( BASE_URL + 'logs', { params: params }).subscribe(data => {
        callback(data['logs']);
    });
  }

  getLogsY( user_id: string, year: number, callback: (msg: string) => void): void {
    const y0 = ('0000' + year).slice(-4);
    // Parameters obj-
    const params: HttpParams = new HttpParams().set('user_id', user_id ).set('year', y0 );

    console.log(params.toString());

    this.http.get( BASE_URL + 'logs', { params: params }).subscribe(data => {
        callback(data['logs']);
    });
  }

  postMessage( body, callback: (msg: string) => void ): void {
    // API GatewayとHTTP通信して、取得成功時にコールバックを行う
    this.http.post( BASE_URL + 'log', body).subscribe(data => {
        callback(data['message']['message']);
    });
  }
}
