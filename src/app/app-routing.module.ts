import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { HomeComponent } from './home/home.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: 'home', component:HomeComponent },
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: '**', component: PageNotFoundComponent }
        ])
    ],
    providers: [ ],
    exports: [ RouterModule ]
})
export class AppRoutingModule { }
