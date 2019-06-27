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
    return this.http.get(this.apiUrl.get);
  }

  getNear(mac: string){
    return this.http.get(this.apiUrl.get + "/lastseen/" + mac);
  }

}
