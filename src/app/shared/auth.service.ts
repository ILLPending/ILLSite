import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { UserData, Roles } from './user-data';
import { ImpossibleLevel } from './impossible-level';

import Pocketbase from 'pocketbase'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(
    private router: Router
    ) {
      
    }
    
  pb = new Pocketbase('https://pb.impossible-list.com')
  user$ = of(this.pb.authStore.model)
  initAuth() {
    this.pb.authStore.onChange((auth) => {
      console.log('authstore changed')
      this.user$ = of(this.pb.authStore.model)
    })
  }

  signIn(email: string, password: string) {
    return this.pb.collection('users').authWithPassword(email, password)
  }

  async createAccount(username: string, email: string, password: string) {
    let _default_pfps:string[] = [
      'https://i.imgur.com/VpruWA0.png',
      'https://i.imgur.com/iyRx1oz.png',
      'https://i.imgur.com/MGx63hR.png',
      'https://i.imgur.com/XvO0dJf.png',
      'https://i.imgur.com/qYRY1qv.png',
      'https://i.imgur.com/xZFAy4E.png',
    ];

    const data = {
      uid: '',
      username: username,
      gd_username: username,
      permissions: 'member',
      illp_points: 0,
      description: '',
      created_levels: 0,
      badges: 'Member',
      show_in_leaderboards: false,
      password: password,
      passwordConfirm: password,
      avatar_url: _default_pfps[Math.round(Math.random() * _default_pfps.length)],
      email: email,
    }
    let record = await this.pb.collection('users').create(data)
    return await this.pb.collection('users').authWithPassword(email, password)
  }

  signOut() {
    this.pb.authStore.clear();
  }

  isCurrentUserAdmin() {
    if(this.pb.authStore.model) {
      return this.pb.authStore.model['permissions'] == 'listAdmin'
    }
    return false;
  }

  async getAllUsers() {
    return this.pb.collection('users').getFullList<UserData>(200, {sort: 'username'});
  }

  async getDataFromGDUsername(username: string) {
    try {
      return await this.pb.collection('users').getFirstListItem<UserData>('gd_username = "'+username+'"', { $autoCancel: false })
    } catch (err) {
      console.log(err)
      return null;
    }
  }

  async getDataFromGDUsernameUnscoped(username: string) {
    try {
      return await this.pb.collection('users').getFirstListItem('gd_username = "'+username+'"', { $autoCancel: false })
    } catch (err) {
      console.log(err)
      return null;
    }
  }

  async getDataFromUID(uid: string) {
    try {
      return await this.pb.collection('users').getFirstListItem(" id = '"+uid+"' ").catch((reason) => {
        // console.log('User', uid, 'is not present in our database')
      })
    } catch {
      return null;
    }
  }

}
