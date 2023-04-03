import { Component, OnChanges, OnInit, SimpleChanges, Input } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { ImpossibleLevel } from '../../shared/impossible-level';

import { LevelServiceService } from '../../shared/level-service.service';
import { NoPreloading } from '@angular/router';
import { UserData } from 'src/app/shared/user-data';
import { useAnimation } from '@angular/animations';
import { faAngleDown, faAngleUp, faCheck, faFloppyDisk, faLayerGroup, faList, faPencil, faSort, faThumbTack, faTrashCan, faTrophy, faUpRightFromSquare, faWrench, faXmark } from '@fortawesome/free-solid-svg-icons';
import { WrServiceService } from 'src/app/shared/wr-service.service';
import { WrSubmission } from 'src/app/shared/wr-submission';

@Component({
  selector: 'app-admin-data-editor',
  templateUrl: './admin-data-editor.component.html',
  styleUrls: ['./admin-data-editor.component.css'],
})
export class AdminDataEditorComponent implements OnInit {
  bil_name: string = '';
  bil_fps: number = 0;
  bil_id: string = '';
  bil_gdv: string = ''; //Gd version
  bil_ytid: string = ''; //Youtube video id
  bil_c_s: string = ''; //Creators short
  bil_c_f: string = ''; //Creators full
  bil_tags: string = '';
  bil_upld: string = ''; //Uploader
  bil_wr_min: string = '';
  bil_wr_yt: string = '';
  bil_wr: string = '';
  bil_removal: boolean = false;
  bil_annotation: boolean = false;
  bil_manualWR:boolean | undefined = false;
  bil_reason: string = ''; //reason for markdown
  bil_wideshotURL: string | undefined = ''; //URL to wide level shot
  bil_darktext: boolean | undefined = false;

  bil_index: number = 1;
  bil_mode: number = 0; //0 create mode; 1 edit mode

  auditLog: string[] = [];

  lists_pinned: boolean = false;

  wr_pendingList:any[] = [];
  wr_levelname:any[] = [];

  bil_packaged: ImpossibleLevel = {
    name: '',
    fps: 0,
    level_id: '',
    gd_version: '',
    yt_videoID: '',
    creators_short: '',
    creators_full: '',
    tags: '',
    uploader: '',
    wr_min_percent: '',
    wr: '',
    wr_yt: '',
    marked_for_removal: false,
    annotated: false,
    marking_reason: '',
    position: 0,
    wide_level_shot_url: '',
    textIsDark: false,
  };
  bli_buffer: ImpossibleLevel = {
    position: 0,
    name: '',
    fps: 0,
    level_id: '',
    gd_version: '',
    yt_videoID: '',
    creators_short: '',
    creators_full: '',
    tags: '',
    uploader: '',
    wr_min_percent: '',
    wr: '',
    wr_yt: '',
    marked_for_removal: false,
    annotated: false,
    marking_reason: '',
    wide_level_shot_url: '',
    textIsDark: false,
  };

  lb_editStatus: string = 'Empty form';
  levelList: ImpossibleLevel[] = [];

  bil_showList: boolean = false;
  bil_showWRList: boolean = false;

  //icons
  i_edit = faPencil;
  i_wrench = faWrench;
  i_list = faList;
  i_up = faAngleUp;
  i_dwn = faAngleDown;
  i_link = faUpRightFromSquare;
  i_wr = faTrophy;
  i_pin = faThumbTack;
  i_save = faFloppyDisk;
  i_clear = faXmark;
  i_delete = faTrashCan
  i_sort = faSort
  i_remap = faLayerGroup;

  @Input('selected-level') selected_level:ImpossibleLevel | undefined;


  constructor(
    public ill_service: LevelServiceService,
    private auth_service: AuthService,
    private wr_service: WrServiceService,
  ) {}

  ngOnInit(): void {
    //load the list once
    this.setupList();
    //handle admin
  }

  toggleMode() {
    if(this.bil_mode == 0) {
      this.bil_mode = 1;
    } else {
      this.bil_mode = 0;
    }
  }
  async setupList() {
    this.levelList = await this.ill_service.getOrderedLevelList()
    this.ill_service.pb.collection('ill').subscribe<ImpossibleLevel>('*', ({ action, record }) => {
      if(action === "create") {
        this.levelList = [...this.levelList, record]
      }
      if(action === "delete") {
        this.levelList = this.levelList.filter((m) => m.id !== record.id);
      }
    })
  }

  clearForm() {
    this.bil_name = '';
    this.bil_fps = 0;
    this.bil_gdv = '';
    this.bil_id = '';
    this.bil_ytid = '';
    this.bil_c_s = '';
    this.bil_c_f = '';
    this.bil_tags = '';
    this.bil_upld = '';
    this.bil_wr_min = '';
    this.bil_wr_yt = '';
    this.bil_wr = '';
    this.bil_removal = false;
    this.bil_annotation = false;
    this.bil_reason = '';
    this.bil_wideshotURL = '';
    this.bil_darktext = false;
    this.bil_manualWR = false;
  }

  async submitLevel() {
    if(this.bil_mode == 0) {
      this.addLevel();
    } else {
      this.editLevel();
    }
  }

  async addLevel() {
    this.packageLevel();
    let _buffer:any = this.bil_packaged
    this.ill_service.pb.collection('ill').create(_buffer)
    this.lb_editStatus = 'Successfully added level!';
    this.auditLog.push(
      'Added level ' + this.bil_packaged.name + ' at #' + this.bil_index
    );
  }

  async editLevel() {
    let old_level = this.bil_packaged
    this.packageLevel();

    //find level
    let matchingLevel = this.levelList.find((arr_level) => {
      return (
        arr_level.name == this.bil_packaged.name &&
        arr_level.creators_short == this.bil_packaged.creators_short
      );
    });

    if(matchingLevel) {
      this.bil_packaged.id = matchingLevel.id;
      this.adminLogChangedData(old_level, this.bil_packaged);
      this.ill_service.updateLevel(this.bil_packaged);
      this.lb_editStatus = 'Successfully updated level!';
    } else {
      this.lb_editStatus = `Level ${this.bil_packaged.name} not found in database. Maybe you wanted to add a new level?`;
    }
  }

  remapLevels() {
    if (confirm('Are you sure you want to Remap all level positions?')) {
      let _changes = 0;
      this.lb_editStatus = 'Re-mapping level positions...';
      for (let i = 0; i < this.levelList.length; i++) {
        console.log(this.levelList[i].position, '=>', i + 1); //compare
        if (this.levelList[i].position != i + 1) {
          console.log(
            'error in ' + this.levelList[i].name + "'s position... fixing..."
          );
          this.levelList[i].position = i + 1;
          console.log(this.levelList[i].position, '->', i + 1);
          if (this.levelList[i].position != i + 1) {
            console.log(
              'Failed to fix ' + this.levelList[i].name + "'s level position"
            );
          } else {
            console.log(
              'Fixing of ' +
                this.levelList[i].name +
                ' complete... Updating level...'
            );
            this.ill_service.updateLevel(this.levelList[i]);
            _changes++;
          }
        }
      }
      this.lb_editStatus = 'Re-mapping complete: ' + _changes + ' changes';
    }
  }

  packageLevel() {
    this.lb_editStatus = 'Packaging level...';

    //the funny
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    //generate ID
    let _id = ''
    for(let i=0; i<15; i++) {
      _id = _id + alphabet[Math.round(Math.random() * alphabet.length)]
    }

    //Packing normal values
    this.bil_packaged = {
      position: this.bil_index,
      name: this.bil_name,
      creators_short: this.bil_c_s,
      fps: this.bil_fps,
      gd_version: this.bil_gdv,
      creators_full: this.bil_c_f,
      tags: this.bil_tags,
      level_id: this.bil_id,
      yt_videoID: this.bil_ytid
      .replace('youtube.com/watch?v=', '')
      .replace('https://', '')
      .replace('www.', '')
      .replace('youtu.be/', ''),
      wide_level_shot_url: this.bil_wideshotURL,
      uploader: this.bil_upld,
      wr_min_percent: this.bil_wr_min,
      wr: this.bil_wr,
      wr_yt: this.bil_wr_yt,
      marked_for_removal: this.bil_removal,
      annotated: this.bil_annotation,
      marking_reason: this.bil_reason,
      textIsDark: this.bil_darktext,
      shouldHaveManualWR: this.bil_manualWR,
    }

    //fix gd versions
    if(this.bil_packaged.gd_version === "1") {
      this.bil_packaged.gd_version = "1.0"
    }
    if(this.bil_packaged.gd_version === "2") {
      this.bil_packaged.gd_version = "2.0"
    }
  }

  logLevelArray() {
    console.log(this.levelList);
  }

  log() {
    console.log(this.bil_name, this.bil_c_s);
  }

  loadDataFromLevel(level: ImpossibleLevel) {
    let matchingLevel = level
    console.log(matchingLevel);
    if (matchingLevel == undefined) {
      this.lb_editStatus = 'No Matching level found';
    } else {
      this.bli_buffer = matchingLevel;

      this.bil_name = this.bli_buffer.name;
      this.bil_c_s = this.bli_buffer.creators_short;
      this.bil_index = this.bli_buffer.position;
      this.bil_fps = this.bli_buffer.fps;
      this.bil_gdv = this.bli_buffer.gd_version;
      this.bil_ytid = this.bli_buffer.yt_videoID;
      this.bil_id = this.bli_buffer.level_id;
      this.bil_upld = this.bli_buffer.uploader;
      this.bil_wr_min = this.bli_buffer.wr_min_percent;
      this.bil_wr_yt = this.bli_buffer.wr_yt;
      this.bil_wr = this.bli_buffer.wr;
      this.bil_removal = this.bli_buffer.marked_for_removal;
      this.bil_annotation = this.bli_buffer.annotated;
      this.bil_reason = this.bli_buffer.marking_reason;
      this.bil_wideshotURL = this.bli_buffer.wide_level_shot_url;
      this.bil_darktext = this.bli_buffer.textIsDark;
      this.bil_manualWR = this.bli_buffer.shouldHaveManualWR

      this.bil_c_f = this.bli_buffer.creators_full.toString();
      this.bil_tags = this.bli_buffer.tags.toString();

      this.bil_removal = this.bli_buffer.marked_for_removal;
      this.bil_annotation = this.bli_buffer.annotated;
      this.lb_editStatus = 'Data loaded';
    }
  }

  async removeLevel() {
    this.packageLevel();
    let matchingLevel = this.levelList.find((arr_level) => {
      return (
        arr_level.name == this.bil_packaged.name &&
        arr_level.creators_short == this.bil_packaged.creators_short
      );
    });
    if (matchingLevel == undefined) {
      this.lb_editStatus = 'No Matching level found';
    } else {
      this.auditLog.push(matchingLevel.name + ' removed');
      this.ill_service.deleteLevel(matchingLevel);
      this.lb_editStatus = 'Removed Level successfully!';
    }
    this.levelList = await this.ill_service.getOrderedLevelList()
  }

  adminLogChangedData(old_data: ImpossibleLevel, new_data: ImpossibleLevel) {
    //compare
    this.auditLog.push('Updated ' + new_data.name + '. Here are the changes: ');
    if (old_data.fps != new_data.fps) {
      this.auditLog.push(
        new_data.name + ' FPS updated: ' + old_data.fps + ' -> ' + new_data.fps
      );
    }
    if (old_data.level_id != new_data.level_id) {
      this.auditLog.push(
        new_data.name +
          ' level ID updated: ' +
          old_data.level_id +
          ' -> ' +
          new_data.level_id
      );
    }
    if (old_data.position != new_data.position) {
      this.auditLog.push(
        new_data.name +
          ' moved from ' +
          old_data.position +
          ' to ' +
          new_data.position
      );
    }
    if (old_data.uploader != new_data.uploader) {
      this.auditLog.push(
        new_data.name + ' uploader updated: ' + new_data.uploader
      );
    }
    if (
      old_data.creators_full.toString() != new_data.creators_full.toString()
    ) {
      this.auditLog.push(new_data.name + ' creators updated');
    }
    if (old_data.tags.toString() != new_data.tags.toString()) {
      this.auditLog.push(
        'Changed tags: ' +
          old_data.tags.toString() +
          ' -> ' +
          new_data.tags.toString()
      );
    }
    if (old_data.wr != new_data.wr) {
      this.auditLog.push(
        'New World record achieved on' +
          new_data.name +
          ': ' +
          new_data.wr +
          ' -> ' +
          '(Link: ' +
          new_data.wr_yt +
          ')'
      );
    }
    if (old_data.wr_min_percent != new_data.wr_min_percent) {
      this.auditLog.push(
        'World Record minimal percentage changed from >' +
          old_data.wr_min_percent +
          '% to >' +
          new_data.wr_min_percent +
          '%'
      );
    }
    if (!old_data.annotated && new_data.annotated) {
      this.auditLog.push(
        'Annotation added to ' +
          new_data.name +
          ' - Subject to gameplay and decoration quality exemptions'
      );
    }
    if (!old_data.marked_for_removal && new_data.marked_for_removal) {
      this.auditLog.push(
        new_data.name + ' marked for removal: ' + new_data.marking_reason
      );
    }
    if (old_data.annotated && !new_data.annotated) {
      this.auditLog.push('Annotation removed from ' + new_data.name);
    }
    if (old_data.marked_for_removal && !new_data.marked_for_removal) {
      this.auditLog.push(new_data.name + ' mark resolved');
    }
    if (old_data.yt_videoID != new_data.yt_videoID) {
      this.auditLog.push(
        new_data.name +
          ' showcase video changed: ' +
          'htpps://www.youtube.com/watch?v=' +
          new_data.yt_videoID
      );
    }
    if (old_data.wide_level_shot_url != new_data.wide_level_shot_url) {
      this.auditLog.push(
        new_data.name +
          ' wideshot changed: ' +
          new_data.wide_level_shot_url
      );
    }
    if (old_data.shouldHaveManualWR != new_data.shouldHaveManualWR) {
      if(new_data.shouldHaveManualWR) {
        this.auditLog.push(
          new_data.name +
            ' disconnected from the online WR system: '
        );
      } else {
        this.auditLog.push(
          new_data.name +
            ' connected to the online WR system: '
        );
      }
    }
  }

  async readd_database_entries() {
    let _real_ill_array: ImpossibleLevel[] = [];
    let _real_ill_keys: string[] = [];

    //load the list
    await this.ill_service.getWholeLevelList().then((snapshot: any) => {
      _real_ill_array = snapshot.docs.map((e: any) => {
        const data = e.data();
        return data;
      });
    });

    //get level database id
    await this.ill_service.getWholeLevelList().then((snapshot: any) => {
      _real_ill_keys = snapshot.docs.map((e: any) => {
        const data = e.id;
        return data;
      });
    });

    console.log(_real_ill_keys);

    await _real_ill_array.forEach((lvl, i) => {
      lvl.textIsDark = false;
      lvl.shouldHaveManualWR = false;
      if(lvl.id) {
        this.ill_service.pb
          .collection('ill')
          .update(lvl.id, lvl);
      }
    });

    console.log('finished');
  }

  async getLevelname(id:string) {
    let record = await this.ill_service.pb.collection('ill').getOne(id)
    return record['name']+"-"+record['creators_short']
  }
}
