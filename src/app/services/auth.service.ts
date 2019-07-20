import {Injectable, NgZone} from '@angular/core';
import {Observable, from, of, forkJoin} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import { delay} from 'rxjs/operators'
import {auth} from 'firebase/app';
import {config} from './../../environments/gapi-config';
import {BehaviorSubject} from 'rxjs'; 

declare var gapi: any;

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(public afAuth: AngularFireAuth) { 
        this.loadClient();
        this.user$ = this.afAuth.authState;
    }

    private _gapiSource = new BehaviorSubject<any>(false);

    user$: Observable<firebase.User>; 
    calendarItems: any[];
    gapiClient$ = this._gapiSource.asObservable();

    // Initialize the Google API client with desired scopes
    private initClient() {
        let {apiKey, clientId, discoveryDocs, scope} = config;

        gapi.client.init({
            apiKey,
            clientId,
            discoveryDocs,
            scope
        }).then(() => {
            gapi.client.load('calendar', 'v3').then(() => {
                this._gapiSource.next(true);
            }).
            catch(error => {
                console.log("Gapi calendar load error");
            }); 
        }).catch(error => {
            console.log("Gapi Initialisation error");
        });
    }

  // load gapi client
  loadClient() {
    gapi.load('client', () => {   
        // pushing "gapi.client.init" call to event queue
        // to align with client load, which happens asyncronously 
        setTimeout(()=>{
            this.initClient();
        }, 0);
    });
     
  }

  // service call to login to Google account
  async login() {
    const googleAuth = gapi.auth2.getAuthInstance()
    const googleUser = await googleAuth.signIn();
    const token = googleUser.getAuthResponse().id_token;
    const credential = auth.GoogleAuthProvider.credential(token);
    console.log(googleUser)

    await this.afAuth.auth.signInWithCredential(credential);
  }

  // service call to logout 
  logout() {
    this.afAuth.auth.signOut();
  }

  // service call to fetch events using gapi
  getCalendarEvents(): Observable<any> {
  
    let events = [];

    if(!!gapi.client.calendar)  {
        events = gapi.client.calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            showDeleted: false,
            singleEvents: true,
            maxResults: 1,
            orderBy: 'startTime'
        });

    }

    return from(events);
  }
}