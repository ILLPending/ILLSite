import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import auth from 'firebase/compat/app'

import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { UserData, Roles } from './user-data';
import { ImpossibleLevel } from './impossible-level';

import Pocketbase from 'pocketbase'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<UserData | undefined | null>;
  userArr: UserData[] = [];

  constructor(
    public pb: Pocketbase,
    private router: Router
  ) {
    this.user$ = of(this.pb.authStore.model)

    pb.authStore.onChange((auth) => {
      this.user$ = of(this.pb.authStore.model)
    })
  }

  signIn(email: string, password: string) {
    return this.pb.collection('users').authWithPassword(email, password)
  }

  createAccount(username: string, email: string, password: string) {
    let _default_pfps:string[] = [
      'https://firebasestorage.googleapis.com/v0/b/impossible-level-list.appspot.com/o/ILL_profilepics%2Fpfp_1.png?alt=media&token=82730092-146b-4184-8cb6-dcf1231be25b',
      'https://firebasestorage.googleapis.com/v0/b/impossible-level-list.appspot.com/o/ILL_profilepics%2Fpfp_2.png?alt=media&token=421075f5-d291-43fa-a152-5f1f1fadd57c',
      'https://firebasestorage.googleapis.com/v0/b/impossible-level-list.appspot.com/o/ILL_profilepics%2Fpfp_3.png?alt=media&token=a67a805c-3376-473b-b5b8-9b6bee91077a',
      'https://firebasestorage.googleapis.com/v0/b/impossible-level-list.appspot.com/o/ILL_profilepics%2Fpfp_4.png?alt=media&token=87af460c-f171-40bf-9a2e-4adf40fec13c',
      'https://firebasestorage.googleapis.com/v0/b/impossible-level-list.appspot.com/o/ILL_profilepics%2Fpfp_5.png?alt=media&token=e12c9cd5-0be1-4d41-abb0-1ab812d180ac',
      'https://firebasestorage.googleapis.com/v0/b/impossible-level-list.appspot.com/o/ILL_profilepics%2Fpfp_6.png?alt=media&token=cb9c532e-a0ec-4de1-8da3-fe02d81c1382',
      'https://firebasestorage.googleapis.com/v0/b/impossible-level-list.appspot.com/o/ILL_profilepics%2Fpfp_7.png?alt=media&token=ee553070-5010-4013-82b3-98ecb69bc3fc',
    ];

    const data: UserData = {
      username: username,
      gd_username: '',
      permissions: 'member',
      illp_points: 0,
      description: '',
      profilePicture: _default_pfps[Math.round(Math.random() * (_default_pfps.length-1))],
      created_levels: 0,
      badges: ['Member'],
      show_in_leaderboards: false,
    }
    this.pb.collection('users').create(data)
    this.pb.collection('users').authWithPassword(email, password)
  }

  signOut() {
    this.pb.authStore.clear();
  }

  isCurrentUserAdmin() {
    let _usr = undefined;
    const _obs = this.user$.subscribe(val => _usr = val);
    console.log(_usr);
  }

  async getAllUsers() {
    return this.pb.collection('user').getFullList<UserData>(200);
  }

  async getDataFromGDUsername(username: string) {
    return await this.pb.collection('user').getFirstListItem<UserData>("gd_username = '"+username+"'")
  }

  async getDataFromUID(uid: string) {
    let _arr: UserData[] = [];
    await this.pb.collection('users').getFirstListItem(" id = '2wtntoh7dx0y28q' ")

    if (_arr.length > 0) {
      return _arr[0];
    } else {
      return null;
    }
  }

}
