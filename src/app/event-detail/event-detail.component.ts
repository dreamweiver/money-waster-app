import { Component, Input , OnDestroy} from '@angular/core';
import { NotificationService } from './../services/notification.service';
import {MatSnackBar} from '@angular/material';

// Custom Daily Rates type
class DailyRates {
    avgDailyCostRate:number;
    avgDailyRevenueRate:number;
}


const totalHrsInDay:number = 8; // total productive hours per day
const totalHrsInMillseconds:number = totalHrsInDay * 60000 * 60; // total hours per millsecond 
const notificationLimit:number = 100; // cost limit when crossed show notification
const dailyRatePreLimit:number = 0;
const revenueRatePreLimit:number = 0;
const delay:number = 1000;

@Component({
    selector: 'event-detail',
    templateUrl: './event-detail.component.html',
    styleUrls: [ './event-detail.component.scss' ]
})
export class EventDetailComponent implements OnDestroy {


    @Input()
    set event(event: any) {
        if(!!event && Object.keys(event).length > 0){
            this.attendeesCount =  event.attendees.length;
            this.meetingDesc = event.description;
            this.meetingTitle = event.summary;
            this.avgDailyRates = this.getDailyAvgRates(event.attendees, totalHrsInMillseconds);

            // track limits & notify user as meeting progresses
            this.initializeLimits(event.id);

            // show live status on screen
            this.showLiveStats(event);
        }
    }

  private timer:number;
  private dailyRatePreLimit = 0;
  private revenueRatePreLimit = 0;

  attendeesCount:number;
  avgDailyRates:DailyRates;
  meetingSince:string;
  liveDailyRates:DailyRates;
  meetingDesc:string;
  meetingTitle:string;

  constructor(private notify:NotificationService,
              private snackBar: MatSnackBar){}

  ngOnDestroy() {
    // Destroy the timer if its still running
    if (this.timer) {
        clearTimeout(this.timer);
    }
  }

  private initializeLimits(id) {
    let eventId = this.notify.getEventId();

    if(eventId !== id){
        this.dailyRatePreLimit = 0;
        this.revenueRatePreLimit = 0;
        this.notify.setEventId(id);
    }
  }


  // show Notifications on screen when Cost Rate or Revenue Rate
  //  crosses 'notificationLimit'
  private _showNoticationsOnLimit(dailyRates) {
    let multiplier = Math.floor(dailyRates.avgDailyCostRate / notificationLimit);
    
    if(multiplier > this.dailyRatePreLimit) {
        this.notify.showNotification("Cost Rate Loss",
         `The Incurred Loss on this meeting has crossed ${multiplier*100} dollars now`,
         "special");
        this.dailyRatePreLimit = multiplier;
      }

    multiplier = Math.floor(dailyRates.avgDailyRevenueRate / notificationLimit);

    if(multiplier > this.revenueRatePreLimit) {
        this.notify.showNotification("Potential Revenue Loss",
        `The Incurred Loss on this meeting has crossed ${multiplier*100} dollars now`,
        "special");
        this.revenueRatePreLimit = multiplier;
    }
  }

  // reset the event status on screen
  private runCleanSlate() {
    this.attendeesCount =  0;
    this.meetingDesc = '';
    this.meetingTitle = '';
    this.avgDailyRates = undefined;
    this.dailyRatePreLimit = 0;
    this.revenueRatePreLimit = 0;
    this.meetingSince = 'NA';
    this.liveDailyRates = undefined;
  }

  private clearData() {
    let snackBarRef;

    !!this.timer && clearTimeout(this.timer); // stop timer when meeting ends
  
    // notify user about meeting has ended
    snackBarRef = this.snackBar.open('Meeting has ended', 'Download report', {
        duration: 10000
    }); 

    // prepare Meeting status report for download (pdf/image)
    snackBarRef.onAction().subscribe(() => {
      
    });

    // clear the event details after meeting has ended
    snackBarRef.afterDismissed().subscribe(() => {
        this.runCleanSlate();
    });
  }

  // Show Live Status of meeting time, cost rate, revenue rate
  private showLiveStats(event){
    let {
        start: {dateTime:eventStTime},
        end: {dateTime:eventEndTime},
        attendees
    } = event; 

    // set up a timer to show live status after every second
    this.timer = setTimeout(_=>{
        let now = new Date();
        let timeDiff = now.getTime() - new Date(eventStTime).getTime();
        let seconds = Math.floor((timeDiff / 1000) % 60);
        let minutes = Math.floor(((timeDiff / (1000*60)) % 60));
        let hours = Math.floor(((timeDiff / (1000*60*60)) % 24));
        let dailyRates:DailyRates = this.getDailyAvgRates(attendees, timeDiff);

        this.meetingSince = `${hours} H ${minutes} M ${seconds} S`;
        this.liveDailyRates = dailyRates;

        // show notifications when cost rate or revenue rate crossed 100$ mark
        this._showNoticationsOnLimit(dailyRates);
        
        // show live status only when meeting is IN-PROGRESS, else 
        // prepare meeting data for download
        if(now.getTime() <= new Date(eventEndTime).getTime()) {
            this.showLiveStats(event);
        } else {
            this.clearData();
        }
      }, delay);
  }


    // calulate Daily Avg Rates for all attendees
    private getDailyAvgRates(attendees, effortInMS ):DailyRates{
        const costRateUnit = 1; // assumed cost rate
        const revenueRateUnit = 2; // assumed revenue rate
        let avgDailyRevenueRate = 0; 
        let avgDailyCostRate = 0;

        for(let attendee of attendees) {
            let nameCount = attendee.email.length;
            let costRateUnitInMS = (costRateUnit * nameCount) / ( 60000 * 60); // cost rate per millisecond
            let revenueRateUnitInMS = (revenueRateUnit * nameCount) / (60000 * 60); // revenue rate per millsecond

            avgDailyCostRate += costRateUnitInMS * effortInMS;
            avgDailyRevenueRate += revenueRateUnitInMS * effortInMS;
        }

        return {
            avgDailyCostRate:Number(avgDailyCostRate.toFixed(3)),
            avgDailyRevenueRate:Number(avgDailyRevenueRate.toFixed(3))
        } 	
    }
}