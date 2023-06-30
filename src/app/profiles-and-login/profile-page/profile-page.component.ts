import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faClipboard, faHammer, faLink, faPlus, faStar, faTools, faTrophy, faUser, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { User } from 'firebase/auth';
import { AuthService } from 'src/app/shared/auth.service';
import { ImpossibleLevel } from 'src/app/shared/impossible-level';
import { LevelServiceService } from 'src/app/shared/level-service.service';
import { UserData } from 'src/app/shared/user-data';
import { WrServiceService } from 'src/app/shared/wr-service.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  user_data:UserData = {
    uid: '',
    permissions: ''
  }
  user_levels:ImpossibleLevel[] = [];
  found_user:boolean = true;
  user_badges:string[] = [];
  user_wrs:any[] = [];
  user_wideshots:string[] = [];
  _full_pfp_url:string = '';

  i_user = faUser;
  i_cup = faTrophy;
  i_star = faStar;
  i_plus = faPlus;
  i_creator = faHammer;
  i_count = faTools;
  i_bio = faClipboard;
  i_verified = faUserCheck;
  i_link = faLink;

  adm_newUsername:string = '';
  adm_newGDUsername:string = '';
  adm_newBio:string = '';

  selected_mascott_name:string = '';
  selected_mascott_path:string = '';
  selected_mascotts = [
    {name: 'Sloom', path: '../../../assets/mascotts/mascott_sloom.png'},
    {name: 'Jerry', path: '../../../assets/mascotts/mascott_jerry.png'},
    {name: 'Ging', path: '../../../assets/mascotts/mascott_ging.png'},
    {name: 'Subsuming Cube', path: '../../../assets/mascotts/mascott_sc.png'},
    {name: 'Hank', path: '../../../assets/mascotts/mascott_hank.png'},
    {name: 'Relife Jump Jumping', path: '../../../assets/mascotts/mascott_relife.png'},
  ];

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    private illservice: LevelServiceService,
    private wrservice: WrServiceService
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.getRandomMascott();
    this.getUserWRs();
  }

  async getUser() {
    let _uid = this.route.snapshot.paramMap.get('id');

    if(_uid) {
      let _temp_usr = await this.authService.getDataFromUID(_uid)
      if(_temp_usr) {
        this.user_data = this.record_to_userdata(_temp_usr);
        this.getUserLevels();
        this.user_badges = _temp_usr['badges'].split(',');
        if(_temp_usr['avatar_url'] != "") {
          this._full_pfp_url = _temp_usr['avatar_url']
        } else {
          this._full_pfp_url = this.authService.pb.getFileUrl(_temp_usr, _temp_usr['avatar'])
        }
      } else {
        this.found_user = false;
      }
    }
  }

  record_to_userdata(r:any) {
    let res:UserData;
    res = {
      uid: r['id'],
      username: r['username'],
      gd_username: r['gd_username'],
      avatar: r['avatar'],
      avatar_url: r['avatar_url'],
      description: r['description'],
      badges: r['badges'],
      ill_verified: r['ill_verified'],
      created_levels: r['created_levels'],
      show_in_leaderboards: r['show_in_leaderboards'],
      banned_from_leaderboards: r['banned_from_leaderboards'],
      banned_from_wrs: r['banned_from_wrs']

    }
    return res;
  }

  async toggleVerified() {
    let _uid = this.route.snapshot.paramMap.get('id');
    console.log(_uid);
    if(_uid) {
      let _temp_usr = await this.authService.getDataFromUID(_uid)
      if(_temp_usr) {
        _temp_usr['ill_verified'] = !_temp_usr['ill_verified'];
        console.log(_temp_usr['id'], _uid);
        await this.authService.pb.collection('users').update(_uid, _temp_usr)
        this.getUser();
      }
    }
  }

  async toggleAdminPerms() {
    let _uid = this.route.snapshot.paramMap.get('id');
    console.log(_uid);
    if(_uid) {
      let _temp_usr = await this.authService.getDataFromUID(_uid)
      if(_temp_usr) {
        if(_temp_usr['permissions'] != 'listAdmin') {
          _temp_usr['permissions'] = 'listAdmin';
        } else {
          
          _temp_usr['permissions'] = 'member';
        }

        await this.authService.pb.collection('users').update(_uid, _temp_usr)
        this.getUser();
      }
    }
  }

  async changeUsername() {
    let _uid = this.route.snapshot.paramMap.get('id');

    if(_uid) {
      let _temp_usr = await this.authService.getDataFromUID(_uid)
      if(_temp_usr) {
        _temp_usr['username'] = this.adm_newUsername;

        await this.authService.pb.collection('users').update(_temp_usr['id'], _temp_usr)
        this.getUser();
      }
    }
  }

  async changeGDUsername() {
    let _uid = this.route.snapshot.paramMap.get('id');

    if(_uid) {
      let _temp_usr = await this.authService.getDataFromUID(_uid)
      if(_temp_usr) {
        _temp_usr['gd_username'] = this.adm_newGDUsername;

        await this.authService.pb.collection('users').update(_temp_usr['id'], _temp_usr)
        this.getUser();
      }
    }
  }

  async changeBio() {
    let _uid = this.route.snapshot.paramMap.get('id');

    if(_uid) {
      let _temp_usr = await this.authService.getDataFromUID(_uid)
      if(_temp_usr) {
        _temp_usr['description'] = this.adm_newBio;

        await this.authService.pb.collection('users').update(_temp_usr['id'], _temp_usr)
        this.getUser();
      }
    }
  }

  async toggleWRBan() {
    let _uid = this.route.snapshot.paramMap.get('id');

    if(_uid) {
      let _temp_usr = await this.authService.getDataFromUID(_uid)
      if(_temp_usr) {
        _temp_usr['banned_from_wrs'] = !_temp_usr['banned_from_wrs'];

        await this.authService.pb.collection('users').update(_temp_usr['id'], _temp_usr)
        this.getUser();
      }
    }
  }

  getRandomMascott() {
    let _rng = Math.round(Math.random() * (this.selected_mascotts.length-1));
    this.selected_mascott_name = this.selected_mascotts[_rng].name
    this.selected_mascott_path = this.selected_mascotts[_rng].path
  }

  async getUserLevels() {
    this.user_levels = await this.illservice.pb.collection('ill').getFullList<ImpossibleLevel>(100, {
      filter: "creators_full ~ '%"+this.user_data.gd_username+"%'", sort: 'position', $autoCancel: false
    })
  }

  async getUserWRs() {
    this.user_wrs = await this.wrservice.pb.collection('wr_submissions').getFullList(200, { filter: `submitted_by.id = "${this.route.snapshot.paramMap.get('id')}"`})
    //add wideshots
    this.wrservice.pb.autoCancellation(false)
    this.user_wrs.forEach(async (wr, i) => {
      this.user_wideshots[i] = await this.getWideshotFromLevelID(wr['level'])
    })

    console.log(this.user_wrs, this.user_wideshots)
  }

  async getWideshotFromLevelID(id:string) {
    let record = await this.illservice.pb.collection('ill').getOne(id, { $autoCancel: false })
    return record['wide_level_shot_url']
  }

}
