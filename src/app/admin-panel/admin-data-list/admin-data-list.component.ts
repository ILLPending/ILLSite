import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faFloppyDisk, faLayerGroup, faSave, faSearch, faSort, faSquareArrowUpRight, faTrash, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ImpossibleLevel } from 'src/app/shared/impossible-level';
import { LevelServiceService } from 'src/app/shared/level-service.service';

@Component({
  selector: 'app-admin-data-list',
  templateUrl: './admin-data-list.component.html',
  styleUrls: ['./admin-data-list.component.css']
})
export class AdminDataListComponent implements OnInit {

  constructor(
    private ill_service: LevelServiceService
  ) { }

  i_search = faSearch;
  i_load = faSquareArrowUpRight;

  levelList:ImpossibleLevel[] = []
  displayLevelList:ImpossibleLevel[] = [];
  

  srch_input:string = '';

  bli_buffer: ImpossibleLevel = {
    id: '',
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

  @Output() selectLevelEvent = new EventEmitter<ImpossibleLevel>();

  ngOnInit(): void {
    this.setupList();
  }

  async setupList() {
    this.levelList = await this.ill_service.getOrderedLevelList()
    this.ill_service.pb.collection('ill').subscribe<ImpossibleLevel>('*', ({ action, record }) => {
      if(action === "create") {
        console.log("Level addition tracked")
        this.levelList = [...this.levelList, record]
        this.levelList.sort((a, b) => {return a.position - b.position})
        this.displayLevelList = this.levelList
      }
      if(action === "update") {
        console.log("Level update tracked")
        //delete current one
        this.levelList = this.levelList.filter((m) => m.id !== record.id);
        //readd it
        this.levelList = [...this.levelList, record]
        this.levelList.sort((a, b) => {return a.position - b.position})
        this.displayLevelList = this.levelList
      }
      if(action === "delete") {
        console.log("Level deletion tracked")
        this.levelList = this.levelList.filter((m) => m.id !== record.id);
      }
    })
    this.displayLevelList = this.levelList
  }

  loadDataFromLevel(level: ImpossibleLevel) {
    let matchingLevel = this.levelList.find((arr_level) => {
      return (
        arr_level.name == level.name &&
        arr_level.creators_short == level.creators_short
      );
    });
    if (matchingLevel == undefined) {
      console.log('No matching level')
    } else {
      this.bli_buffer = matchingLevel;
      this.selectLevelEvent.emit(this.bli_buffer)
    }
  }

  searchILL() {
    let _tempList: ImpossibleLevel[] = [];
    if(this.srch_input != "" && this.srch_input != " ") {

      _tempList = this.levelList.filter((e:ImpossibleLevel) => {
        return e.name.toLowerCase().includes(this.srch_input.toLowerCase());
      });

      this.displayLevelList = _tempList;
    } else {
      this.displayLevelList = this.levelList;
    }
  }

}
