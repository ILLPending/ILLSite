import { Component, OnInit } from '@angular/core';
import { faCheck, faCross, faLink, faXmark } from '@fortawesome/free-solid-svg-icons';
import { WrServiceService } from 'src/app/shared/wr-service.service';
import { WrSubmission } from 'src/app/shared/wr-submission';

@Component({
  selector: 'app-admin-wr-panel',
  templateUrl: './admin-wr-panel.component.html',
  styleUrls: ['./admin-wr-panel.component.css']
})
export class AdminWrPanelComponent implements OnInit {

  constructor(
    private wrservice: WrServiceService
  ) { }

  pending_wr_list:WrSubmission[] = [];
  pending_wrs_progress_start:Number[] = []
  pending_wrs_progress_end:Number[] = []
  pending_wrs_progress_width:Number[] = []
  pending_wrs_wideshots:string[] = []

  //icons
  i_approve = faCheck;
  i_reject = faXmark;
  i_link = faLink;

  audit_log:string[] = [];

  ngOnInit(): void {
    this.setupWRs();
  }

  async setupWRs() {
    //load all pending WRs
    this.pending_wr_list = await this.wrservice.pb.collection('wr_submissions').getFullList(200, { filter: 'status = "pending"'});

    //get end-start numbers of all
    this.pending_wr_list.forEach(async (wr, i) => {
      if(!wr.isFromZero) {
        this.pending_wrs_progress_start[i] = Number(wr.progress.replaceAll("%", "").replaceAll(" ", "").split('-')[0])
        this.pending_wrs_progress_end[i] = Number(wr.progress.replaceAll("%", "").replaceAll(" ", "").split('-')[1])
        this.pending_wrs_progress_width[i] = Number(this.pending_wrs_progress_end[i]) - Number(this.pending_wrs_progress_start[i])
      } else {
        this.pending_wrs_progress_start[i] = 0;
        this.pending_wrs_progress_end[i] = Number(wr.progress.replaceAll("%", "").replaceAll(" ", ""))
        this.pending_wrs_progress_width[i] = Number(wr.progress.replaceAll("%", "").replaceAll(" ", ""))
      }

      //get wideshots
      let record = await this.wrservice.pb.collection('ill').getOne(wr.level, { $autoCancel: false })
      this.pending_wrs_wideshots[i] = record['wide_level_shot_url']
    })

    //setup realtime
    this.wrservice.pb.collection('wr-submissions').subscribe<WrSubmission>('*', ({action, record}) => {
      if(action === 'update') {
        if(record['status'] != 'pending') {
          console.log("WR no longer pending tracked")
          this.pending_wr_list = this.pending_wr_list.filter((m) => m.id !== record.id);
        }
      }
      if(action === 'create') {
        if(record['status'] == 'pending') {
          console.log("New pending WR tracked")
          this.pending_wr_list = [...this.pending_wr_list, record]
        }
      }
      if(action === 'delete') {
        console.log("WR deletion tracked");
        this.pending_wr_list = this.pending_wr_list.filter((m) => m.id !== record.id);
      }
    })
  }

  async rejectSubmission(id:string | undefined) {
    if(id) {
      this.wrservice.changeWRStatus(id, 'Rejected', 'No custom reason provided. Rejected via quick-rejection. Possible reasons: No proof, unrealistic run, joke submission');
      let record = await this.wrservice.pb.collection('wr_submissions').getOne(id)
      this.pending_wr_list = this.pending_wr_list.filter((m) => m.id !== id);
      this.log('Submission '+record['id']+'('+record['level_name']+" "+record['progress']+') was rejected')
    }
  }
  
  async approveSubmission(id:string | undefined) {
    if(id) {
      this.wrservice.changeWRStatus(id, 'Approved', '')
      let record = await this.wrservice.pb.collection('wr_submissions').getOne(id)
      this.pending_wr_list = this.pending_wr_list.filter((m) => m.id !== id);
      this.log('Submission '+record['id']+'('+record['level_name']+" "+record['progress']+') was approved')
    }
  }

  async removeAllRejectedSubmissions() {
    this.log('Deleting all rejected submissions...')
    let records = await this.wrservice.pb.collection('wr_submissions').getFullList(200, { filter: 'status = "Rejected"' })
    for(let wr of records) {
      this.log('Submission '+wr['id']+'('+wr['level_name']+" "+wr['progress']+') was deleted')
      this.wrservice.pb.collection('wr_submissions').delete(wr['id']).catch((r) => {
        this.log(r)
      })
    }
  }

  async removeAllPendingSubmissions() {
    this.log('Deleting all pending submissions...')
    let records = await this.wrservice.pb.collection('wr_submissions').getFullList(200, { filter: 'status = "pending"' })
    for(let wr of records) {
      this.log('Submission '+wr['id']+'('+wr['level_name']+" "+wr['progress']+') was deleted')
      this.wrservice.pb.collection('wr_submissions').delete(wr['id']).catch((r) => {
        this.log(r)
      })
    }
  }

  log(msg:string) {
    this.audit_log.push(msg)
  }

}
