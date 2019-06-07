import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GuideModalComponent } from '../guide-modal/guide-modal.component';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.css']
})

export class GuideComponent {

  constructor(private modalService: NgbModal, ) {
  }
  
  openWinCmd() {
    const modalRef = this.modalService.open(GuideModalComponent, {size: 'lg'});
    modalRef.componentInstance.title = "How to get Mac Address, Windows 10, Command Prompt";
    modalRef.componentInstance.setMaterials({
      'img': "assets/img/win-cmd-from-search-1.jpg", 
      'description': "1. Search Command Prompt from Windows menu or Search",
    });
    modalRef.componentInstance.setMaterials({
      'img': "assets/img/win-cmd-ipconfig-all-2.jpg", 
      'description': "2. Write \"ipconfig /all\" to get information",
    });
    modalRef.componentInstance.setMaterials({
      'img': "assets/img/win-cmd-macAddress-result-3.jpg", 
      'description': "3. Check the \"Physical Address\" from result values",
    });
  }

  openWinControlP() {
    const modalRef = this.modalService.open(GuideModalComponent, {size: 'lg'});
    modalRef.componentInstance.title = "How to get Mac Address, Windows 10, Control Panel";
    modalRef.componentInstance.setMaterials({
      'img': "assets/img/win-controlp-1.jpg", 
      'description': "1. Search Control Panel from Windows menu or search",
    });
    modalRef.componentInstance.setMaterials({
      'img': "assets/img/win-controlp-network-2.jpg", 
      'description': "2. Go to Network and Internet section - View network status and tasks",
    });
    modalRef.componentInstance.setMaterials({
      'img': "assets/img/win-controlp-network-connection-3.jpg", 
      'description': "3. Go to connected connection",
    });
    modalRef.componentInstance.setMaterials({
      'img': "assets/img/win-controlp-network-connection-detail-4.jpg", 
      'description': "4. Go to \"Details\" on \"connection\" section",
    });
    modalRef.componentInstance.setMaterials({
      'img': "assets/img/win-controlp-network-connection-detail-result-5.jpg", 
      'description': "5. Check the \"Physical Address\" among available property values",
    });
  }

  open() {
    const modalRef = this.modalService.open(GuideModalComponent, {size: 'lg'});
    modalRef.componentInstance.title = "How to get Mac Address, Windows 10, Command Prompt";
    modalRef.componentInstance.setMaterials({'img': "assets/img/win-cmd-from-search-1.jpg", 'description': "1. Search Command Prompt from Windows menu or Search"});
    modalRef.componentInstance.setMaterials({'img': "assets/img/win-cmd-ipconfig-all-2.jpg", 'description': "2. Write \"ipconfig /all\" to get information"});
    modalRef.componentInstance.setMaterials({'img': "assets/img/win-cmd-macAddress-result-3.jpg", 'description': "3. Check the \"Physical Address\" from result values"});
  }
}
