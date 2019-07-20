import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { config } from './../environments/firebase.env';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './app.material.module';


@NgModule({
    imports: [
        BrowserModule,
        AngularFireModule.initializeApp(config),
        AngularFireAuthModule,
        BrowserAnimationsModule,
        AppMaterialModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        EventDetailComponent,
        PageNotFoundComponent
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
