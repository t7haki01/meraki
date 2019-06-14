import { Injectable } from '@angular/core';
import { BingMap } from '../modules/BingMap.js';
@Injectable({
  providedIn: 'root'
})
export class StatusService {

  msg: string = '';
  loading: boolean = true;

  constructor(){}

  getMsg(){
    return BingMap.getStatus();
  }

  setStatus(){
    BingMap.loadingDone();
  }

}
