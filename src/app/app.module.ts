import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 import { RouterModule, Routes } from '@angular/router';
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
import { HealthHacksComponent } from './health-hacks/health-hacks.component';
import { AdDisplayComponent } from './ad-display/ad-display.component';
import { HeaderComponent } from './header/header.component';
import { RightPanelComponent } from './right-panel/right-panel.component';
import { FooterComponent } from './footer/footer.component';
import { SingleArticleComponent } from './single-article/single-article.component';

@NgModule({
  declarations: [
    AppComponent,
    HealthHacksComponent,
    AdDisplayComponent,
    HeaderComponent,
    RightPanelComponent,
    FooterComponent,
    SingleArticleComponent
  ],
  imports: [
    BrowserModule,
     RouterModule,
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
  providers: [SingleArticleComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
