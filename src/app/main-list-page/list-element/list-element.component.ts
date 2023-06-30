import { RouterModule, Routes } from '@angular/router';

import { Component, Inject, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { LevelServiceService } from 'src/app/shared/level-service.service'
import { ImpossibleLevel } from '../../shared/impossible-level'
import { Attribute } from '@angular/compiler';
import {
  animate, state, style, transition, trigger
} from '@angular/animations';

import {

} from '@fortawesome/fontawesome-svg-core'
import { faAngleDown, faAngleUp, faBarsStaggered, faBook, faBookmark, faCheckCircle, faDeleteLeft, faEllipsis, faHourglass, faInfo, faInfoCircle, faScrewdriverWrench, faStar, faStarHalf, faStopwatch, faTag, faTrophy, faUpRightFromSquare, faXmark } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/shared/auth.service';
import { UserData } from 'src/app/shared/user-data';
import { WrServiceService } from 'src/app/shared/wr-service.service';
import { WrSubmission } from 'src/app/shared/wr-submission';

@Component({
  selector: 'app-list-element',
  templateUrl: './list-element.component.html',
  styleUrls: ['./list-element.component.css'],
})
export class ListElementComponent implements OnInit {

  //Component data
  level_name = "CYCLOLCYC";
  level_position = 1;
  level_creators_short = "Eightos and more";
  level_creators_full: string[] = []
  level_fps = 1974;
  level_id = '77018514'; //Write Unreleased if not given
  level_gd_version = '2.1';
  level_tags: string[] = []
  level_minimal_wr_percent = '>2%'
  level_wr = '0.092% (eli22507)';
  level_wr_yt = 'https://youtu.be/xD9BWvMZGm4'
  level_uploader = 'Xane88'
  level_marked_for_removal = false;
  level_annotated = true;
  level_markdown_reason = '';
  level_isRated = false;
  level_isUnRated = false;
  level_creatorPFPs: string[] = [];
  level_creatorPFPs_limited: string[] = [];
  level_creatorAccounts: any[] = [];
  level_shouldHaveManualWR: boolean | undefined = false;

  level_wrID_run: any;
  level_wrID_0: any;

  card_expanded = false;
  card_mobile_expanded = false;
  card_yt_videoID = 'DqB2uTY9-Ss'
  card_yt_vidEmbedURL: SafeResourceUrl | undefined;
  card_yt_thumbnailURL: SafeResourceUrl | undefined;
  card_wideshot_link: SafeResourceUrl | undefined;
  card_haswideshot: boolean = false;

  //icons
  i_annotation = faBookmark;
  i_removal = faXmark;
  i_info = faInfoCircle;
  i_creators = faScrewdriverWrench;
  i_wr = faTrophy;
  i_verified = faCheckCircle;
  i_fps = faHourglass;
  i_levelID = faBarsStaggered;
  i_tag = faTag;
  i_expand = faAngleDown;
  i_collapse = faAngleUp;
  i_rated = faStar;
  i_unrated = faStarHalf;
  i_link = faUpRightFromSquare;
  i_more = faEllipsis;

  gifs: string[] = [
    '../../../assets/loading-gifs/Loading_1.gif',
    '../../../assets/loading-gifs/Loading_2.gif',
    '../../../assets/loading-gifs/Loading_3.gif',
    '../../../assets/loading-gifs/Loading_4.gif'
  ];
  ld_gif: string = ''

  //all data in 1 object
  @Input('ill_level') ill_level: ImpossibleLevel = {
    id: '',
    position: 0,
    name: 'The Cyclonic',
    fps: -1820385,
    level_id: '77018514',
    gd_version: '2.2',
    yt_videoID: 'DqB2uTY9-Ss',
    creators_short: 'everyone & skub',
    creators_full: 'eightos,orbperson,maus999,Ewe23,HSWSmokeWeed,TiO2,MagYTU,Aeqing1,Linear,AuraXalaiv,Arekushi14,Darmuth,skubb,Deactive,Xane88',
    tags: 'Rated,Previously Rated,sex,girl,lol',
    uploader: 'Xane88',
    wr_min_percent: '0.01',
    wr: '0.092% (eli22507)',
    wr_yt: 'https://youtu.be/xD9BWvMZGm4',
    marked_for_removal: true,
    annotated: true,
    marking_reason: 'Simply unfunny, horrendous, impossible to playtest and generally bad',
    wide_level_shot_url: 'https://media.discordapp.net/attachments/598756348829892647/1043253620772196362/unknown.png'
  };
  @Input('ill_position') ill_position?: number;
  constructor(public sanitizer: DomSanitizer, public authService: AuthService, private wr_service: WrServiceService) {
  }


  ngOnInit(): void {

    //transfer stuff from object to separate vars (Angular is goofy)
    this.level_name = this.ill_level.name;
    this.level_fps = this.ill_level.fps;
    this.level_id = this.ill_level.level_id.toString();
    this.level_gd_version = this.ill_level.gd_version;
    this.card_yt_videoID = this.ill_level.yt_videoID;
    this.level_creators_short = this.ill_level.creators_short;
    this.level_creators_full = this.ill_level.creators_full.replaceAll(" ", "").split(",") //convert from string to array
    this.level_tags = this.ill_level.tags.split(",") //convert to array
    this.level_uploader = this.ill_level.uploader;
    this.level_minimal_wr_percent = this.ill_level.wr_min_percent;
    this.level_wr = this.ill_level.wr;
    this.level_wr_yt = this.ill_level.wr_yt;
    this.level_marked_for_removal = this.ill_level.marked_for_removal;
    this.level_annotated = this.ill_level.annotated;
    this.level_position = this.ill_level.position;
    this.level_gd_version = this.ill_level.gd_version;
    this.level_markdown_reason = this.ill_level.marking_reason;
    this.card_yt_vidEmbedURL = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this.card_yt_videoID)
    this.card_yt_thumbnailURL = this.sanitizer.bypassSecurityTrustResourceUrl('https://i.ytimg.com/vi/' + this.card_yt_videoID + '/mqdefault.jpg')
    this.level_isRated = this.level_tags.includes('Rated');
    this.level_isUnRated = this.level_tags.includes('Previously Rated');
    this.level_shouldHaveManualWR = this.ill_level.shouldHaveManualWR;

    //more setting up
    this.setupwideshot();
    this.addPFPs();
    this.getWRData();

    //loading gif my beloved
    this.ld_gif = this.randomLoadingGif();
  }

  async getWRData() {
    let _wrs_runs
    let _wrs_runs_0

    console.log(`level.id = '${this.ill_level.id}' && status = "Approved" && isFromZero = false`)
    _wrs_runs = await this.wr_service.pb.collection('wr_submissions').getFirstListItem(`level.id = '${this.ill_level.id}' && status = "Approved" && isFromZero = false`).catch((r) => {
      console.log("lack of approved WR not from zero")
    })

    console.log(`level.id = '${this.ill_level.id}' && status = "Approved" && isFromZero = true`)
    _wrs_runs_0 = await this.wr_service.pb.collection('wr_submissions').getFirstListItem(`level.id = '${this.ill_level.id}' && status = "Approved" && isFromZero = true`).catch((r) => {
      console.log("lack of approved WR from zero")
    })

    if (_wrs_runs && _wrs_runs != null) {
      this.level_wrID_run = _wrs_runs['id']
    } else {

    }


    if (_wrs_runs_0 && _wrs_runs_0 != null) {
      this.level_wrID_0 = _wrs_runs_0['id']
    }
    console.log("id:", this.ill_level.id, "wr_id non 0:", this.level_wrID_run, "wr_id from 0:", this.level_wrID_0)

  }

  addPFPs() {
    //counter
    let _cnt = 0;

    //loop through every single creator
    this.level_creators_full.forEach(async (creator, i) => {
      //get their sweet data
      let _pfp = await this.authService.getDataFromGDUsernameUnscoped(creator)
      if (_pfp) {
        //increase counter if valid, then push to the full array
        _cnt++
        this.level_creatorAccounts.push(_pfp);

        //check what kind of pfp it is (custom or default)
        if (_pfp['avatar'] != null) {
          if (_pfp['avatar_url'].startsWith('https://i.imgur')) {
            //default pfp

            //push avatars to their respective arrays
            this.level_creatorPFPs.push(_pfp['avatar_url'])
            if (_cnt <= 3) {
              this.level_creatorPFPs_limited.push(_pfp['avatar_url'])
            }
          } else {

            //push avatars to their respective arrays
            this.level_creatorPFPs.push(this.authService.pb.getFileUrl(_pfp, _pfp['avatar'], { thumb: '48x48f' }))
            if (_cnt <= 3) {
              this.level_creatorPFPs_limited.push(this.authService.pb.getFileUrl(_pfp, _pfp['avatar'], { thumb: '48x48f' }))
            }
          }
        }
      }
    });
  }

  //scrolls up
  scrollUp() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  setupwideshot() {
    this.card_wideshot_link = this.sanitizer.bypassSecurityTrustResourceUrl('' + this.ill_level.wide_level_shot_url);

    //disallow white text on light theme
    //wtf is this
    if (this.ill_level.wide_level_shot_url != '') {
      this.card_haswideshot = true;
    } else {
      this.card_haswideshot = false;
    }

  }

  expandCard() {
    if (!this.card_mobile_expanded) {
      this.card_mobile_expanded = true && window.innerWidth <= 820;
    }
    else if (this.card_mobile_expanded) {
      this.card_mobile_expanded = !(true && window.innerWidth <= 820);
    }
    if (!this.card_expanded) {
      this.card_expanded = true && window.innerWidth > 820;
    }
    else if (this.card_expanded) {
      this.card_expanded = !(true && window.innerWidth > 820);
    }
  }

  randomLoadingGif() {
    return this.gifs[Math.floor(Math.random() * (this.gifs.length - 1))];
  }
}
