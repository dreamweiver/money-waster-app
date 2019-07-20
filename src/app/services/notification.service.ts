import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';

declare var webNotification: any;

const icons = {
    normal: 'assets/images/office-calendar.ico',
    special: 'assets/images/office-alert.ico'
};

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private permissionGranted: boolean = false;
    eventId:string;

    constructor( private snackBar: MatSnackBar) {
        //manually ask for notification permissions 
        // (invoked automatically if needed and allowRequest=true)
        webNotification.requestPermission(granted => {
            if (granted) {
                this.permissionGranted = true;
            } else {
                this.permissionGranted = false;
            }
        });
    }

    // service all to show web notification (if supported) or 
    // normal notifications(IE browser)
    showNotification(title, msg, type){
        if(this.permissionGranted){
          webNotification.showNotification(title, {
                body: msg,
                icon: icons[type],
                autoClose: 5000 //auto close the notification after 4 seconds (you can manually close it via hide function)
            }, function onShow(error, hide) {
                if (error) {
                    window.alert('Unable to show notification: ' + error.message);
                }
            });
        } else {
            // if Browser doesnt support Web Notificaton, then show normal messages
            let snackBarRef;
            let fullMsg = `${title} : ${msg}`;
            snackBarRef = this.snackBar.open(fullMsg ,'' , {
                duration: 5000
            }); 
        }
    }

  getEventId():string {
    return this.eventId || undefined;
  }

  setEventId(id) {
    this.eventId = id;
  }
}