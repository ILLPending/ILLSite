import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { User } from 'firebase/auth';
import { async, last } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { Roles, UserData } from 'src/app/shared/user-data';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {

  //setup vars for the form
  bil_username:string | undefined = '';
  bil_old_gd_username:string | undefined = '';
  bil_gd_username:string | undefined = '';
  bil_bio:string | undefined = '';
  bil_shownInLeaderboards:boolean | undefined = true;
  bil_profilepicture:string | undefined = '';
  bil_email:string | undefined = ''
  bil_roles:Roles | undefined;
  bil_pfp_file: File | undefined;
  bil_errLabel:string = '';
  bil_uid:string | undefined = '';

  bil_hasLoaded:boolean = true;
  bil_showUploadAnim:boolean = false;

  bil_canContinue:boolean = true;
  _user_uid:string | undefined = ''

  buffer_user:Object | undefined;

  _username_correct:boolean = true;

  i_gear = faGear;

  constructor(
    public authService: AuthService,
    private router: Router,
  ) 
  {

  }

  ngOnInit(): void {
    // this.bil_gd_username = 'poopy'
    this.loadUserData();
  }

  async loadUserData() {
    if(this.authService.pb.authStore.model != null) {
      let _usr = await this.authService.pb.collection('users').getOne(this.authService.pb.authStore.model.id)
      this._user_uid = this.authService.pb.authStore.model.id
      this.bil_username = _usr['username'];
      this.bil_gd_username = _usr['gd_username'];
      this.bil_old_gd_username = _usr['gd_username'];
      this.bil_bio = _usr['description'];
      this.bil_shownInLeaderboards = _usr['show_in_leaderboards'];
      this.bil_uid = _usr['uid'];
    } else {
      console.log('user not logged in');
    }
  }

  packageUserData() {
    this.buffer_user = {
      uid: this._user_uid,
      username: this.bil_username,
      gd_username: this.bil_gd_username,
      profilePicture: this.bil_profilepicture,
      description: this.bil_bio,
      show_in_leaderboards: this.bil_shownInLeaderboards
    }
  }

  async updateUserData() {
    this.packageUserData();
    //get matching usernames
    let _temp_mtch_usr:any[];

    _temp_mtch_usr = await this.authService.pb.collection('users').getFullList(200, { filter: "gd_username = '"+this.bil_gd_username+"'"})
    console.log(_temp_mtch_usr)

    if(this.bil_username && this.bil_username?.length > 150) {
      this.bil_errLabel = 'Your username is too long!'
      this.bil_canContinue = false
    }
    else if(this.bil_username && this.bil_username?.length > 1000) {
      this.bil_errLabel = 'Tio pls stop trying to crash the website with text >:('
      this.bil_canContinue = false
    }
    else if(this.bil_username && this.bil_username?.length <= 150) {
      this.bil_errLabel = ''
      this.bil_canContinue = true;

    }
    if(this.bil_gd_username && this.bil_gd_username?.length > 0) {
      if(_temp_mtch_usr.length > 0 && this.authService.pb.authStore.model) {
        if(_temp_mtch_usr[0]['id'] == this.authService.pb.authStore.model.id) {
          this.bil_canContinue = true;
        } else {
          this.bil_errLabel = 'A user with this gd username is already on the website!'
          this.bil_canContinue = false
        }
      } else {
        this.bil_canContinue = true;
      }
    } else {
      //gd username is empty
      this.bil_canContinue = true;
    }
    if(this.bil_canContinue && this.authService.pb.authStore.model) {
      let err = false;
        console.log(this.authService.pb.authStore.model.id)
        console.log(this._user_uid)
        await this.authService.pb.collection('users').update(this.authService.pb.authStore.model.id, this.buffer_user)
        if(!err) {
          this.router.navigate(["/"]);
        }
    }
  }

  pfpFileChange($event:any) {
    this.bil_pfp_file = $event.target.files[0];
  }

  async test() {
    if(this.authService.pb.authStore.model) {
      await this.authService.pb.collection('users').update(this.authService.pb.authStore.model.id, { username: 'jim' })
    }
  }

  
  usernameChange() {
    if(this.bil_username && this.bil_username.includes(" ")) {
      this._username_correct = false;
    } else {
      this._username_correct = true;
    }
  }

  async updatePFP() {
    //setup
    this.bil_showUploadAnim = true;
    const formData = new FormData()
    if(this.bil_pfp_file) {
      formData.append('avatar', this.bil_pfp_file)
    }
    if(this.bil_pfp_file && this.bil_pfp_file.size < 1080549) {
      if(this._user_uid && this.authService.pb.authStore.model) {
        await this.authService.pb.collection('users').update(this._user_uid, formData).catch((r) => console.log(r))
        
        //fix up avatar url
        let record = await this.authService.pb.collection('users').getOne(this.authService.pb.authStore.model.id);
        console.log(record['avatar'])
        let _obj = {
          avatar_url: `https://pb.impossible-list.com/api/files/_pb_users_auth_/${this._user_uid}/${record['avatar']}`
        }
        await this.authService.pb.collection('users').update(this._user_uid, _obj)
        this.bil_showUploadAnim = false;
      }
    } else {
      this.bil_errLabel = 'File cannot be larger than 1MB'
      this.bil_showUploadAnim = false;
    }

  }
  
  cancelUserUpdate() {
    this.router.navigate(["/"]);
  }
}
