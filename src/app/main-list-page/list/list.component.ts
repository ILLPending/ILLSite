import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Observable, BehaviorSubject } from 'rxjs';
import { ImpossibleLevel } from 'src/app/shared/impossible-level'
import { LevelServiceService } from '../../shared/level-service.service';

//I LOVE importing a shit ton of icons :/
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faBarsStaggered,
  faBone,
  faBong,
  faBorderAll,
  faBugSlash,
  faCannabis,
  faCat,
  faChildRifle,
  faClipboardCheck,
  faClock,
  faCloudMoon,
  faCode,
  faCodeBranch,
  faCookie,
  faCrown,
  faDatabase,
  faDragon,
  faEye,
  faFilter,
  faFish,
  faFishFins,
  faGhost,
  faHourglass,
  faHurricane,
  faImage,
  faInfinity,
  faKiwiBird,
  faLightbulb,
  faListOl,
  faLock,
  faMound,
  faP,
  faPeopleGroup,
  faPlus,
  faPoo,
  faScrewdriverWrench,
  faSearch,
  faShieldCat,
  faSkull,
  faSortDown,
  faSpa,
  faSpider,
  faStar,
  faTag,
  faTerminal,
  faTooth,
  faTractor,
  faUmbrella,
  faUpRightFromSquare,
  faYinYang
} from '@fortawesome/free-solid-svg-icons'
import { formatNumber } from '@angular/common';
import { faUmbraco, faXing, faYandex } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  //List rendering
  levelListToDisplay: ImpossibleLevel[] = [];
  currentPage: number = 1;
  pageSize: number = 100;
  listSorted: boolean = false;

  //facts
  ill_randomFact: string = '';

  //search
  _ill: ImpossibleLevel[] = [];
  _ill_results: ImpossibleLevel[] = [];
  srch_input: string = '';
  srch_criteria: string = 'any';
  srch_dropdown: boolean = false;
  srch_showingSearchResults: boolean = false;
  srch_sortBy: string = 'position';
  srch_tags: string[] = [];
  srch_possibleTags: string[] = [
    "2p",
    "Unnerfed",
    "Old Version",
    "Fix required",
    "Former top 1"
  ];
  srch_finalPage: boolean = false;

  //visual
  _currentTheme = localStorage['theme'];
  loading_gif: string = '';
  gifs: string[] = [
    '../../../assets/loading-gifs/Loading_1.gif',
    '../../../assets/loading-gifs/Loading_2.gif',
    '../../../assets/loading-gifs/Loading_3.gif',
    '../../../assets/loading-gifs/Loading_4.gif'
  ];

  //icons
  i_name = faDatabase;
  i_tag = faTag;
  i_creator = faScrewdriverWrench;
  i_version = faCodeBranch;
  i_id = faBarsStaggered;
  i_arrLeft = faAngleLeft;
  i_arrRight = faAngleRight;
  i_doublearrowLeft = faAnglesLeft;
  i_doublearrowRight = faAnglesRight;
  i_expand = faSortDown;
  i_addition = faClipboardCheck;
  i_bugfix = faBugSlash;
  i_fps = faHourglass;
  i_illrf = faStar;
  i_search = faSearch;
  i_link = faUpRightFromSquare;
  i_plus = faPlus;
  i_position = faListOl
  i_time = faClock;
  i_any = faBorderAll;
  i_sort = faFilter;

  //user icons
  i_MateussDev = faCode;
  i_Locked101 = faLock;
  i_sequoia = faSkull;
  i_Numb = faSpa;
  i_Trin = faBong;
  i_maus999 = faTractor;
  i_Pamka = faP
  i_Wuro = faShieldCat;
  i_Tomejito = faMound;
  i_skele = faBone;
  i_Relayne = faYandex;
  i_AuraXalaiv = faDragon;
  i_Eightos = faPoo;
  i_skub = faCat;
  i_krx = faTerminal;
  i_Akyse = faCloudMoon;
  i_Remy = faPeopleGroup;
  i_PhiPan = faHurricane;
  i_doki = faCrown;
  i_Xane = faXing;
  i_knali = faEye;
  i_buk = faLightbulb;
  i_blanket = faTooth;
  i_ewe = faYinYang;
  i_zodiac = faUmbrella;
  i_sobot = faChildRifle;
  i_alex = faInfinity;
  i_moonfrost = faImage;
  i_electro = faGhost;
  i_yan = faCookie;
  i_luned = faFishFins;
  i_erzor = faCat;
  i_furii = faKiwiBird;
  i_PieGuy = faCannabis;
  i_vaixen = faSpider;
  i_hexi = faFish;

  //banner
  url_banner: any = '';

  //random array with length 100 filled with random gifs programmatically
  _ld: string[] = []

  constructor(private ill_service: LevelServiceService) {
  }



  async ngOnInit() {
    //load random gif for loader
    this.loading_gif = this.randomLoadingGif();

    //create 100 long array and fill in with random gifs
    for (let i = 0; i < 100; i++) {
      this._ld.push(this.randomLoadingGif());
    }

    this.initList();

  }


  async initList() {
    //get ILL from backend and split it up into pages
    await this.getILLForSearch();
    this.cutPagev2(0, this.pageSize);


    // this.listSorted = false; //debug lol


    this.getRandomILLFact();
    this.getBanner();
  }

  async getBanner() {
    let _bnr = await this.ill_service.pb.collection('banners').getFirstListItem('isPicked = true')
    this.url_banner = _bnr['url']
  }

  async getILLForSearch() {
    this._ill = [];
    this._ill = await this.ill_service.getOrderedLevelList()
  }

  cutPagev2(start: number, end: number) {
    //no longer searching
    this.srch_showingSearchResults = false;

    //map an array to a local var because js is funny
    let _temp_ill = this._ill.map((e) => { return e })

    //stop the list from displaying and show loading screen
    this.listSorted = false;

    //actually cut out the levels to match the page
    _temp_ill.splice(end, 9999)
    _temp_ill.splice(0, start) //remove start

    //debug
    console.log("levels from", start, "to", end, "in display. Display length:", _temp_ill.length)

    //render list
    this.levelListToDisplay = _temp_ill;
    this.listSorted = true;
  }

  cutSrchPagev2(start: number, end: number, array: ImpossibleLevel[]) {
    //in search mode. You put the array of ILL levels here cuz idk I was sleepy back then
    let _temp_ill = array.map((e) => { return e })

    //stop the list from displaying and show loading screen
    this.listSorted = false;

    //actually cut out the levels to match the page
    _temp_ill.splice(end, 9999)
    _temp_ill.splice(0, start) //remove start

    //debug
    console.log("levels from", start, "to", end, "in display")

    //render list
    this.levelListToDisplay = _temp_ill;
    this.listSorted = true;
  }

  pageFwd() {
    console.log('Moving forward')
    if (this.srch_showingSearchResults) {
      if (this.currentPage < this._ill_results.length / this.pageSize) {
        this.srch_finalPage = false;
        //move page index
        this.currentPage += 1;

        //debug
        // console.log("loading elements from", (this.currentPage - 1) * this.pageSize, "to", ((this.currentPage - 1) * this.pageSize) + this.pageSize)
        this.cutSrchPagev2((this.currentPage - 1) * this.pageSize, ((this.currentPage - 1) * this.pageSize) + this.pageSize, this._ill_results);
      }
    } else {
      if (this.currentPage < this._ill.length / this.pageSize) {
        this.currentPage += 1;
        // console.log("loading elements from", (this.currentPage - 1) * this.pageSize, "to", ((this.currentPage - 1) * this.pageSize) + this.pageSize)
        this.cutPagev2((this.currentPage - 1) * this.pageSize, ((this.currentPage - 1) * this.pageSize) + this.pageSize);
      }
    }

    //scroll up
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  pageBck() {
    console.log('Moving back')
    this.srch_finalPage = false;
    if (this.currentPage > 1) {
      //move page index
      this.currentPage -= 1;

      //debug
      // console.log("loading elements from", (this.currentPage - 1) * this.pageSize, "to", ((this.currentPage - 1) * this.pageSize) + this.pageSize)
      
      //cut out the page based off search
      if (this.srch_showingSearchResults) {
        this.cutSrchPagev2((this.currentPage - 1) * this.pageSize, ((this.currentPage - 1) * this.pageSize) + this.pageSize, this._ill_results);
      } else {
        this.cutPagev2((this.currentPage - 1) * this.pageSize, ((this.currentPage - 1) * this.pageSize) + this.pageSize);
      }

      //scroll up
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }
  }

  pageFirst() {
    this.srch_finalPage = false;
    this.currentPage = 1;
    if (this.srch_showingSearchResults) {
      this.cutSrchPagev2(0, this.pageSize, this._ill_results);
    } else {
      this.cutPagev2(0, this.pageSize);
    }
  }


  pageLast() {
    this.srch_finalPage = false;
    if (this.srch_showingSearchResults) {
      this.currentPage = Math.floor(this._ill_results.length / this.pageSize) + 1;
      this.cutSrchPagev2((this.currentPage - 1) * this.pageSize, ((this.currentPage - 1) * this.pageSize) + this.pageSize, this._ill_results);
    } else {
      this.currentPage = Math.floor(this._ill.length / this.pageSize) + 1;
      this.cutPagev2((this.currentPage - 1) * this.pageSize, ((this.currentPage - 1) * this.pageSize) + this.pageSize);

    }
  }

  //functions for frontend :/
  toggleSearchDropdown() {
    this.srch_dropdown = !this.srch_dropdown;
  }

  selectCriteria(crit: string) {
    this.srch_criteria = crit;
  }

  selectSort(sort: string) {
    this.srch_sortBy = sort;
  }

  toggleTag(tag: string) {
    let _idx = this.srch_tags.findIndex(x => x == tag)
    if (_idx == -1) {
      this.srch_tags.push(tag);
    } else {
      this.srch_tags.splice(_idx, 1)
    }
  }

  hasTag(tag: string): boolean {
    return this.srch_tags.indexOf(tag) != -1;
  }

  //Mr beast
  async search_v2(prompt: string, criteria: string, matchTags: string[], sortBy?: string) {

    if (prompt == undefined || prompt == "") {
      this.cutPagev2(0, this.pageSize);
    } else {
      //Hide to show it's doing smth
      this.listSorted = false;
      this.levelListToDisplay = [];
      this.srch_showingSearchResults = true;
      this.currentPage = 1;



      // * Do fetching
      let _tempList: ImpossibleLevel[] = [];

      if (criteria == "any") {

        //Names
        _tempList = _tempList.concat(this._ill.filter((e: ImpossibleLevel) => {
          return e.name.toLowerCase().includes(prompt.toLowerCase());
        }));

        //Fps
        _tempList = _tempList.concat(this._ill.filter((e: ImpossibleLevel) => {
          return e.fps == Number(prompt);
        }));

        //GD version
        _tempList = _tempList.concat(this._ill.filter((e: ImpossibleLevel) => {
          return e.gd_version.toLowerCase().includes(prompt.toLowerCase());
        }));

        //Level id
        _tempList = _tempList.concat(this._ill.filter((e: ImpossibleLevel) => {
          return e.level_id == prompt;
        }));

        //Creators
        _tempList = _tempList.concat(this._ill.filter((e: ImpossibleLevel) => {
          return e.creators_full.toLowerCase().includes(prompt.toLowerCase());
        }));


      } else if (criteria == "name") {
        //Names
        _tempList = _tempList.concat(this._ill.filter((e: ImpossibleLevel) => {
          return e.name.toLowerCase().includes(prompt.toLowerCase());
        }));
      } else if (criteria == "creator") {
        //Creators
        _tempList = _tempList.concat(this._ill.filter((e: ImpossibleLevel) => {
          return e.creators_full.toLowerCase().includes(prompt.toLowerCase());
        }));

      } else if (criteria == "fps") {
        //Fps
        _tempList = _tempList.concat(this._ill.filter((e: ImpossibleLevel) => {
          return e.fps == Number(prompt);
        }));
      } else if (criteria == "gd_version") {
        //GD version
        _tempList = _tempList.concat(this._ill.filter((e: ImpossibleLevel) => {
          return e.gd_version.toLowerCase().includes(prompt.toLowerCase());
        }));
      } else if (criteria == "level_id") {
        //Level id
        _tempList = _tempList.concat(this._ill.filter((e: ImpossibleLevel) => {
          return e.level_id == prompt;
        }));
      }
      // * Finalize list

      //delete duplicates
      for (let i = _tempList.length; i > 0; i--) {
        for (let j = 0; j < _tempList.length; j++) {
          if (i != j) {
            if (_tempList[i] != undefined && _tempList[j] != undefined) {
              if (_tempList[i].name == _tempList[j].name && _tempList[i].creators_short == _tempList[j].creators_short) {
                console.log("duplicate found: ", _tempList[i].name, "by", _tempList[i].creators_short);
                _tempList.splice(i, 1);
              }
            }
          }
        }
      }

      //delete unmatching tags
      if (matchTags.length > 0) {
        for (let i = 0; i < matchTags.length; i++) {
          _tempList = _tempList.filter((e: ImpossibleLevel) => {
            return e.tags.indexOf(matchTags[i]) != -1;
          })
        }
      } else {
        //do nothing
      }

      if (sortBy == undefined || sortBy == "position") {
        //sort by position
        _tempList = _tempList.sort((a, b) => {
          return a.position - b.position;
        })
      } else if (sortBy == "fps") {
        //sort by position
        _tempList = _tempList.sort((a, b) => {
          return Number(b.fps) - Number(a.fps);
        })
      } else if (sortBy == "level_id") {
        //sort by position
        _tempList = _tempList.sort((a, b) => {
          return Number(a.level_id) - Number(b.level_id);
        })
      }
      this._ill_results = _tempList.map((e) => { return e })
      this.cutSrchPagev2(0, this.pageSize, _tempList)
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }
  }

  resort(sortBy: string) {
    let _tempList = this._ill;
    this.listSorted = false;
    this.levelListToDisplay = [];
    this.srch_showingSearchResults = true;
    if (sortBy == undefined || sortBy == "position") {
      //sort by position
      _tempList = _tempList.sort((a, b) => {
        return a.position - b.position;
      })
    } else if (sortBy == "fps") {
      //sort by position
      _tempList = _tempList.sort((a, b) => {
        return Number(b.fps) - Number(a.fps);
      })
    } else if (sortBy == "level_id") {
      //sort by position
      _tempList = _tempList.sort((a, b) => {
        return Number(a.level_id) - Number(b.level_id);
      })
    }
    this._ill_results = _tempList.map((e) => { return e })
    this.cutSrchPagev2(0, this.pageSize, _tempList)
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  //more front end functions
  async getRandomILLFact() {
    //get all facts
    let _allFacts = await this.ill_service.pb.collection('facts').getFullList()
    //select random fact
    this.ill_randomFact = _allFacts[Math.floor(Math.random() * _allFacts.length)]['fact'];
  }

  randomLevel() {
    this.toggleSearchDropdown();
    this.levelListToDisplay = []
    this.levelListToDisplay[0] = this._ill[Math.floor(Math.random() * this._ill.length)]
  }

  randomLoadingGif() {
    return this.gifs[Math.floor(Math.random() * (this.gifs.length - 1))];
  }
}
