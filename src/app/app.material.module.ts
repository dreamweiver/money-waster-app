import { NgModule } from '@angular/core';
import { MatButtonModule,
    MatGridListModule, 
    MatCardModule,
    MatListModule, 
    MatToolbarModule,
    MatInputModule,
    MatChipsModule,
    MatSnackBarModule } from '@angular/material';

@NgModule({
    imports: [
        MatButtonModule,
        MatGridListModule,
        MatCardModule,
        MatListModule,
        MatToolbarModule,
        MatInputModule,
        MatChipsModule,
        MatSnackBarModule
    ],
    exports: [
        MatButtonModule,
        MatGridListModule,
        MatCardModule,
        MatListModule,
        MatToolbarModule,
        MatInputModule,
        MatChipsModule,
        MatSnackBarModule
    ],
})
export class AppMaterialModule { }