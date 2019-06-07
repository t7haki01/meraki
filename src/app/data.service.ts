import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import setting from '../assets/settings.js';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  urlGetByMac = setting.apiUrl.getByMac;

  constructor(
    private http: HttpClient
  ) { }

  getByMac(mac: string): Observable<Object>{
    return this.http.get(this.urlGetByMac + mac);
  }

}
