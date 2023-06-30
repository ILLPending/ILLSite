import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMenuComponent } from './admin-panel/admin-menu/admin-menu.component';
import { ListComponent } from './main-list-page/list/list.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginPageComponent } from './profiles-and-login/login-page/login-page.component';
import { CreateAccountComponent } from './profiles-and-login/create-account/create-account.component';
import { FaqComponent } from './main-list-page/faq/faq.component';
import { AccountSettingsComponent } from './profiles-and-login/account-settings/account-settings.component';
import { ProfilePageComponent } from './profiles-and-login/profile-page/profile-page.component';
import { WrSubmissionPageComponent } from './ILLP/wr-submission-page/wr-submission-page.component';
import { WrEntryComponent } from './ILLP/wr-entry/wr-entry.component';
import { ExpHomePageComponent } from './Experiments/exp-home-page/exp-home-page.component';
import { ExpIllGptComponent } from './Experiments/exp-ill-gpt/exp-ill-gpt.component';
import { ExpLevelIdeaGeneratorComponent } from './Experiments/exp-level-idea-generator/exp-level-idea-generator.component';
import { RulesComponent } from './misc/rules/rules.component';

const routes: Routes = [
  { path: 'admin', component: AdminMenuComponent, canActivate: [AuthGuard] },
  { path: 'home', component: ListComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'ads.txt', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: CreateAccountComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'account-settings', component: AccountSettingsComponent },
  { path: 'profile/:id', component: ProfilePageComponent },
  { path: 'wr-submission', component: WrSubmissionPageComponent },
  { path: 'wr/:id', component: WrEntryComponent },
  { path: 'experiments', component: ExpHomePageComponent },
  { path: 'experiments/ill-gpt', component: ExpIllGptComponent },
  { path: 'experiments/level-idea', component: ExpLevelIdeaGeneratorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
