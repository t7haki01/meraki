import { Component, Input } from '@angular/core';
import { NgbActiveModal, } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-guide-modal',
  templateUrl: './guide-modal.component.html',
  styleUrls: ['./guide-modal.component.css']
})
export class GuideModalComponent{
  @Input() materials: Array<Object> = [];
  @Input() title: string;
  @Input() target: string;
  constructor(public activeModal: NgbActiveModal) {}
  
  setTitle(title:string, target:string){
    this.title = title;
    this.target = target;
  }

  setMaterials( material:Object ){
    this.materials.push(material);
  }
}
