import { Component, OnInit } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/shared/auth.service';
import { UserData } from 'src/app/shared/user-data';

@Component({
  selector: 'app-admin-profiles-panel',
  templateUrl: './admin-profiles-panel.component.html',
  styleUrls: ['./admin-profiles-panel.component.css']
})
export class AdminProfilesPanelComponent implements OnInit {

  i_search = faSearch;

  srch_input = '';

  profiles:UserData[] = [];
  displayProfiles:UserData[] = [];
  profile_avatars:string[] = [];
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUsers()
  }

  async loadUsers() {
    this.profiles = await this.authService.getAllUsers()
    
    this.profiles.forEach(async (user, i) => {
      let val = await this.getUserAvatar(user)
      if(val != null) {
        this.profiles[i].avatar_url = val
      }
    })
    
    this.displayProfiles = this.profiles
  }

  searchUsers() {
    let _tempList:UserData[] = [];
    if(this.srch_input != "" && this.srch_input != " ") {

      _tempList = this.profiles.filter((e:UserData) => {
        if(e.username) {
          return e.username.toLowerCase().includes(this.srch_input.toLowerCase());
        }
        return null
      });
      
      this.displayProfiles = _tempList;

      _tempList = []
      _tempList = this.profiles.filter((e:UserData) => {
        if(e.gd_username) {
          return e.gd_username.toLowerCase().includes(this.srch_input.toLowerCase());
        }
        return null
      });
      this.displayProfiles = this.displayProfiles.concat(_tempList);

      //gather duplicates
      let listToDelete:number[] = []
      this.displayProfiles.forEach((profile, i) => {
        this.displayProfiles.forEach((profile_2, j) => {
          if(profile.gd_username == profile_2.gd_username && listToDelete.find(dupe => dupe == i)) {
            listToDelete.push(i)
          }
        })
      })

      listToDelete.forEach((duplicate, i) => {
        this.displayProfiles.splice(duplicate, 1)
      })

    } else {
      this.displayProfiles = this.profiles;
    }
  }

  async getUserAvatar(user:UserData) {
    if(user.avatar != null && user.avatar_url && user.id) {
      if(user.avatar_url.startsWith('https://i.imgur')) {
        return user.avatar_url
      } else if(user.avatar_url.startsWith('1.')) {
        return '../../../assets/lennard.png'
      }else {
        let record = await this.authService.getDataFromUID(user.id)
        if(record) {
          return this.authService.pb.getFileUrl(record, record['avatar'])
        } else {
          return '../../../assets/lennard.png'
        }
      }
    } else {
      return '../../../assets/lennard.png'
    }
  }
}
