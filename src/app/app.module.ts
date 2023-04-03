import { NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

//Components
import { ListElementComponent } from './main-list-page/list-element/list-element.component';
import { ListComponent } from './main-list-page/list/list.component';
import { AdminDataEditorComponent } from './admin-panel/admin-data-editor/admin-data-editor.component';
import { AdminMenuComponent } from './admin-panel/admin-menu/admin-menu.component';
import { LoginPageComponent } from './profiles-and-login/login-page/login-page.component';

//Firebase setup
import { environment } from 'src/environments/environment';

//Import services
import { LevelServiceService } from 'src/app/shared/level-service.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

//Material
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { CreateAccountComponent } from './profiles-and-login/create-account/create-account.component';
import { FaqComponent } from './main-list-page/faq/faq.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RoleElemComponent } from './misc/role-elem/role-elem.component';
import { AccountSettingsComponent } from './profiles-and-login/account-settings/account-settings.component';
import { ProfilePageComponent } from './profiles-and-login/profile-page/profile-page.component';
import { BundleComponent } from './ILLP/bundle/bundle.component';
import { WrWidgetComponent } from './ILLP/wr-widget/wr-widget.component';
import { WrEntryComponent } from './ILLP/wr-entry/wr-entry.component';
import { BundlePageComponent } from './ILLP/bundle-page/bundle-page.component';
import { IllpHomePageComponent } from './ILLP/illp-home-page/illp-home-page.component';
import { WrSubmissionPageComponent } from './ILLP/wr-submission-page/wr-submission-page.component'

import Pocketbase from 'pocketbase'

//adsense
import { AdsenseModule } from 'ng2-adsense';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from './shared/auth.service';
import { AdminDataListComponent } from './admin-panel/admin-data-list/admin-data-list.component';
import { AdminWrPanelComponent } from './admin-panel/admin-wr-panel/admin-wr-panel.component';
import { AdminIllpPanelComponent } from './admin-panel/admin-illp-panel/admin-illp-panel.component';
import { AdminProfilesPanelComponent } from './admin-panel/admin-profiles-panel/admin-profiles-panel.component';
import { AdminMiscPanelComponent } from './admin-panel/admin-misc-panel/admin-misc-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    ListElementComponent,
    ListComponent,
    AdminDataEditorComponent,
    AdminMenuComponent,
    LoginPageComponent,
    CreateAccountComponent,
    FaqComponent,
    RoleElemComponent,
    AccountSettingsComponent,
    ProfilePageComponent,
    BundleComponent,
    WrWidgetComponent,
    WrEntryComponent,
    BundlePageComponent,
    IllpHomePageComponent,
    WrSubmissionPageComponent,
    AdminDataListComponent,
    AdminWrPanelComponent,
    AdminIllpPanelComponent,
    AdminProfilesPanelComponent,
    AdminMiscPanelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormsModule,
    ScrollingModule,
    FontAwesomeModule,
    HttpClientModule
  ],
  providers: [LevelServiceService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
