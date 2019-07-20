import { Component, OnDestroy, NgZone} from '@angular/core';
import { AuthService } from './../services/auth.service';
import { NotificationService } from './../services/notification.service';

const delay:number = 60 * 1000;

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ]
})

export class HomeComponent implements  OnDestroy {

	constructor(public auth: AuthService,
				 private ngZone: NgZone,
				 private notify:NotificationService
				 ) {
		// wait until user has logged in, to fetch events
		this.auth.user$.subscribe((userData)=>{
		  	if(!!userData) {
		  		this.isLoggedIn = true;
		  		// after gapi is loaded successfully, fetch events
			  	this.auth.gapiClient$.subscribe((status)=> {
			  		!!status && this.checkEvents();
			  	});
			} else {
				this.isLoggedIn = false;
			}
		});
	}

	ngOnDestroy() {
	  	// destroy timer , if running
		if (this.timer) {
			clearTimeout(this.timer);
		}
	}

	private timer:number;

	activeEvent:any;
	isLoggedIn:boolean = false;

	// Constantly check for active events 
	checkEvents() {
		this.auth.getCalendarEvents().subscribe(events => {
			let calendarEvents = events.result.items; 

			this.activeEvent = '';
			for(let event of calendarEvents) {
				let eventStTime: Date;
  				let now:Date;
  				let eventId = this.notify.getEventId();

  				// convert Date object 
				eventStTime = new Date(event.start.dateTime);
				now = new Date();

				// check whether event/meeting has started or not
				if(now.getTime() >= eventStTime.getTime()) {

					if(eventId !== event.id){
						this.notify.showNotification(event.summary,
						 "Meeting has started",
						 "normal");
					}
					
					// clear 'checkEvents' timer , if running
					clearTimeout(this.timer);

					this.ngZone.run( () => {
						this.activeEvent = event;
					});
				}
			}

			// do a routine check every 1 minute
			this.timer = setTimeout(_ => {
			  this.checkEvents(); 
			}, delay);  // calendar refresh time is set to 1 minute, as its a costly operation
		});
	}
}