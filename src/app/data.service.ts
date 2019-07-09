import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import setting from '../assets/settings.js';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  apiUrl = setting.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getByMac(mac: string, date_from: string, date_to: string): Observable<Object>{
    let params = new HttpParams();
    params = params.append('date_from', date_from);
    params = params.append('date_to', date_to);
    return this.http.get(this.apiUrl.get + mac, {params: params});
  }

  getRecent(): Observable<Object>{
    console.log(this.apiUrl.origin);
    console.log(this.apiUrl.href);
    return this.http.get(this.apiUrl.get);
  }

  getNear(mac: string){
    return this.http.get(this.apiUrl.get + "/lastseen/" + mac);
  }

  get3Hours(): Observable<Object>{
    let params = new HttpParams();
    console.log(this.curDate());
    params = params.append('delay', "3");
    params = params.append('limit', "0");
    return this.http.get(this.apiUrl.get, {params: params});
  }

  getToday(): Observable<Object>{
    let params = new HttpParams();
    console.log(this.curDate());
    params = params.append('date_from', this.curDate());
    params = params.append('date_to', this.curDate());
    params = params.append('limit', "0");
    return this.http.get(this.apiUrl.get, {params: params});
  }

  curDate(){
    let today  = new Date();
    let yr = today.getFullYear();
    let mon: any = today.getMonth() + 1 ;
    if(mon < 10){
      mon = "0" + mon;
    }
    let date: any = today.getDate();
    if(date<10)
      date = "0" + date;
    
    return yr + "-" + mon + "-" + date;
  }

}
