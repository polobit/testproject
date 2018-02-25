import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import {
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatLineModule,
  MatButtonModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatMenuModule,
  MatCardModule,
  MatTabsModule,
  MatDialogModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatTooltipModule,
  MatNativeDateModule,
  MatChipsModule
} from '@angular/material';
import { HomePageComponent } from './home-page/home-page.component';
import { HealthHacksComponent } from './health-hacks/health-hacks.component';
import { AdDisplayComponent } from './ad-display/ad-display.component';

@NgModule({
  declarations: [
    AppComponent,
    // routingComponents
    HomePageComponent,
    HealthHacksComponent,
    AdDisplayComponent
  ],
  imports: [
    BrowserModule,
    // RouterModule,
    HttpModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatLineModule,
    MatCardModule,
    FormsModule,
    MatGridListModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatCardModule,
    MatTabsModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTooltipModule,
    // MatExpansionModule,
    MatChipsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
