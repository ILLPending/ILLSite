import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from './shared/auth.service';
import { UserData } from './shared/user-data';
import { Router, RouterOutlet } from '@angular/router';
import { faCog, faCookieBite, faCube, faFileLines, faFlask, faHistory, faHome, faMoon, faPerson, faQuestionCircle, faRankingStar, faRefresh, faRightFromBracket, faRightToBracket, faRotateRight, faScroll, faSun, faToolbox, faTrophy, faUser, faWrench, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faDiscord, faPatreon } from '@fortawesome/free-brands-svg-icons';
import { LevelServiceService } from './shared/level-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor (
    public ill_service: LevelServiceService,
    public authService: AuthService,
    public router: Router,
  ) {}
  title = 'Impossible Level List';

  _themeRef:string = 'light';

  _showAccInfo:boolean = false;
  _acceptedCookies:boolean = false;

  _showHotButtonData:boolean = false;

  

  //icons
  i_discord = faDiscord;
  i_patreon = faPatreon;
  i_oldList = faFileLines;
  i_faq = faQuestionCircle;
  i_logout = faRightFromBracket;
  i_login = faRightToBracket;
  i_darkmode = faMoon;
  i_lightmode = faSun;
  i_refresh = faRotateRight;
  i_admin = faWrench;
  i_wr = faTrophy;
  i_home = faHome;
  i_cross = faXmark;
  i_exp = faFlask;
  i_rules = faScroll;

  i_profile = faUser;
  i_gdusername = faCube;
  i_settings = faCog;
  i_stats = faRankingStar;
  i_cookies = faCookieBite;

  hideSC2Message:boolean = false;
  
  
  
  ngOnInit(): void {
    //auth
    this.authService.initAuth();
    //themes
    if (localStorage['theme'] === 'dark' || (!('theme' in localStorage))) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
      this._themeRef = 'dark';
      localStorage['theme'] = 'dark'
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
      this._themeRef = 'light';
      localStorage['theme'] = 'light'
    }

    //setup SC2message
    this.hideSC2Message = localStorage['sc2_msg'];
    
    //setup parallax
    window.addEventListener("scroll", (e) => {
      let sidebarL = document.getElementById("sidebar_L")
      let sidebarR = document.getElementById("sidebar_R")
      let sidebarLD = document.getElementById("sidebar_LD")
      let sidebarRD = document.getElementById("sidebar_RD")
      let scrollY = window.scrollY;

      if(sidebarL && sidebarR) {
        sidebarL.style.top = scrollY * -0.25 + 'px'
        sidebarR.style.top = scrollY * -0.25 + 'px'
      }
      if(sidebarLD && sidebarRD) {
        sidebarLD.style.top = scrollY * -0.25 + 'px'
        sidebarRD.style.top = scrollY * -0.25 + 'px'
      }
    })
  }
  
  toggleTheme() {
    console.log('here')
    if(localStorage['theme'] === 'dark') {
      this._themeRef = 'light'
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
      localStorage['theme'] = 'light'
    } else if (localStorage['theme'] === 'light') {
      this._themeRef = 'dark'
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
      localStorage['theme'] = 'dark'
    }
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  toggleAccountDropdown() {
    this._showAccInfo = !this._showAccInfo;
  }

  toggleHotButton() {
    this._showHotButtonData = !this._showHotButtonData;
  }

  turnOffSC2Message() {
    localStorage['sc2_msg'] = true;
    this.hideSC2Message = true;
  }

}
