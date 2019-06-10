import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getByMac(mac: string): Observable<Object>{
    return this.http.get(this.apiUrl.get + mac);
  }
  getRecent(): Observable<Object>{
    return this.http.get(this.apiUrl.get);
  }

}
