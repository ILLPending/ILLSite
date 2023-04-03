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
  pb = new Pocketbase('https://139.144.183.80:433')

  async submitWR(wr:WrSubmission) {
    let _wr = wr;
    _wr.status = 'pending';
    _wr.submitted_at = Date.now();
    _wr.$key = '';
    let record = await this.pb.collection('wr_submissions').create(_wr)
    _wr.$key = record.id
    return this.pb.collection('wr_submissions').update(_wr.$key, _wr)
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
    this.router.navigate(['/wr/'+wr.$key])
  }
}
