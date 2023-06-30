import { Injectable } from '@angular/core';
import Pocketbase from 'pocketbase'
import { WrSubmission } from './wr-submission';
import { AuthService } from './auth.service';
import { last } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WrServiceService {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { 
    
  }
  pb = new Pocketbase('https://pb.impossible-list.com')

  async submitWR(wr:WrSubmission) {
    let _wr = wr;
    _wr.status = 'pending';
    return await this.pb.collection('wr_submissions').create(_wr)
  }

  async getWRFromID(id:string) {
    return await this.pb.collection('wr_submissions').getOne<WrSubmission>(id)
  }

  changeWRStatus(wrKey:string, status:string, reason?: string) {
    return this.pb.collection('wr_submissions').update(wrKey, {status: status, reject_reason: reason})
  }

  async getAllSubmissions() {
    return await this.pb.collection('wr_submissions').getFullList<WrSubmission>(200)
  }

  openWRPage(wr:WrSubmission) {
    this.router.navigate(['/wr/'+wr.id])
  }
}
