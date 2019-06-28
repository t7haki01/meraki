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
    modalRef.componentInstance.target = "Windows 10, Home edition";
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
    modalRef.componentInstance.target = "Windows 10, Home edition";
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

  openAndroidGalaxy() {
    const modalRef = this.modalService.open(GuideModalComponent, {size: 'lg'});
    modalRef.componentInstance.title = "How to get Mac Address, Android, Galaxy";
    modalRef.componentInstance.target = "Android, Galaxy A6 2018";
    modalRef.componentInstance.setMaterials({'img': "assets/img/android-home-galaxy.jpg", 'description': "1. Tap the \"Setting\" icon from home screen"});
    modalRef.componentInstance.setMaterials({'img': "assets/img/android-setting-galaxy.jpg", 'description': "2. Swipe down to tap \"About phone\" to get information"});
    modalRef.componentInstance.setMaterials({'img': "assets/img/android-about-galaxy.jpg", 'description': "3. Tap the \"Status\" among available options"});
    modalRef.componentInstance.setMaterials({'img': "assets/img/android-status-galaxy.jpg", 'description': "4. Check the \"Wi-Fi MAC address\" among available options"});
  }

  openMacTerminal() {
    const modalRef = this.modalService.open(GuideModalComponent, {size: 'lg'});
    modalRef.componentInstance.title = "How to get Mac Address, MAC, Terminal";
    modalRef.componentInstance.target = "Mac Mini";
    modalRef.componentInstance.setMaterials({'img': "assets/img/mac-cmd-ifconfig-1.jpg", 'description': "1. Open terminal then write \"ifconfig\" "});
    modalRef.componentInstance.setMaterials({'img': "assets/img/mac-cmd-ifconfig-result-2.jpg", 'description': "2. Check the value of \"ether\" from available results"});
  }
  openMacSystemPreferences() {
    const modalRef = this.modalService.open(GuideModalComponent, {size: 'lg'});
    modalRef.componentInstance.title = "How to get Mac Address, MAC, System Preferences";
    modalRef.componentInstance.target = "Mac Mini";
    modalRef.componentInstance.setMaterials({'img': "assets/img/mac-system-preferences-1.jpg", 'description': "1. Open \"System Preferences...\" from the Apple menu at the top left of screen"});
    modalRef.componentInstance.setMaterials({'img': "assets/img/mac-system-preferences-network-2.jpg", 'description': "2. Go to \"Network\" from \"Internet & Wireless\" section"});
    modalRef.componentInstance.setMaterials({'img': "assets/img/mac-system-preferences-network-connected-3.jpg", 'description': "3. Check the \"Wi-Fi\" available options from left then go to \"Advanced..\" at the bottom right"});
    modalRef.componentInstance.setMaterials({'img': "assets/img/mac-system-preferences-network-connected-hardware-result-4.jpg", 'description': "4. Go to \"Hardware\" from available options on the top then check the Mac Address"});
  }
  openIOSIphone() {
    const modalRef = this.modalService.open(GuideModalComponent, {size: 'lg'});
    modalRef.componentInstance.title = "How to get Mac Address, IOS, IPhone";
    modalRef.componentInstance.target = "IPhone 5";
    modalRef.componentInstance.setMaterials({'img': "assets/img/iphone-home-settings-1.jpg", 'description': "1. Open \"Settings\" from home screen"});
    modalRef.componentInstance.setMaterials({'img': "assets/img/iphone-settings-general-2.jpg", 'description': "2. Go to \"General\" from available options"});
    modalRef.componentInstance.setMaterials({'img': "assets/img/iphone-general-about-3.jpg", 'description': "3. Go to \"About\" from available options"});
    modalRef.componentInstance.setMaterials({'img': "assets/img/iphone-about-result-4.jpg", 'description': "4. Scroll/Swipe down little to check \"Wi-Fi Address\" from available results"});
  }
  openUbuntu() {
    const modalRef = this.modalService.open(GuideModalComponent, {size: 'lg'});
    modalRef.componentInstance.title = "How to get Mac Address, Ubuntu, Terminal";
    modalRef.componentInstance.target = "Ubuntu 18.04";
    modalRef.componentInstance.setMaterials({'img': "assets/img/ubuntu-open-cmd-1.jpg", 'description': "1. Search \"Terminal\" from Menu or Search"});
    modalRef.componentInstance.setMaterials({'img': "assets/img/ubuntu-cmd-ifconfig-2.jpg", 'description': "2 - 1. Write \"ifconfig | grep ether\" to get filtered information"});
    modalRef.componentInstance.setMaterials({'img': "assets/img/ubuntu-cmd-ifconfig-result-3.jpg", 'description': "2 - 2. Check \"ether\" from result"});
    modalRef.componentInstance.setMaterials({'img': "", 'description': "Or"});
    modalRef.componentInstance.setMaterials({'img': "assets/img/ubuntu-cmd-ipaddr-4.jpg", 'description': "3 - 1. Write \"ip addr | grep ether\" to get filtered information"});
    modalRef.componentInstance.setMaterials({'img': "assets/img/ubuntu-cmd-ipaddr-result-5.jpg", 'description': "3 - 2. Check \"ether\" from result"});

  }
}
