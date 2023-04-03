import { Component, OnInit } from '@angular/core';
import { faCircleQuestion, faListOl, faRankingStar, faTrophy, faUser } from '@fortawesome/free-solid-svg-icons';
import { ImpossibleLevel } from 'src/app/shared/impossible-level';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css']
})
export class AdminMenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  //icons
  i_list = faListOl;
  i_illp = faRankingStar;
  i_wrs = faTrophy;
  i_profiles = faUser;
  i_misc = faCircleQuestion;

  ill_selectedLevel:ImpossibleLevel | undefined = undefined;

  current_tab:string = 'list'

  selectLevel(lvl:ImpossibleLevel) {
    this.ill_selectedLevel = lvl;
    console.log(this.ill_selectedLevel)
  }

  changeTab(tab:string) {
    this.current_tab = tab;
  }
}
