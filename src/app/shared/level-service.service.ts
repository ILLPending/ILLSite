import { Injectable } from '@angular/core';
import { ImpossibleLevel } from './impossible-level';
import Pocketbase from 'pocketbase'

@Injectable({
  providedIn: 'root'
})
export class LevelServiceService {
  constructor() {
  }

  pb = new Pocketbase('https://139.144.183.80:433')


  getEntireLevelList() {
    return this.pb.collection('ill').getFullList<ImpossibleLevel>(200)
  }

  getWholeLevelList() {
    return this.pb.collection('ill').getFullList<ImpossibleLevel>(200)
  }

  async getOrderedLevelList() {
    let arr = await this.pb.collection('ill').getFullList<ImpossibleLevel>(100, { sort: 'position', $autoCancel: false})
    return arr
  }

  addLevel(level:ImpossibleLevel) {
    
    // level.id = record.id
    return this.pb.collection("ill").create(level);
  }

  updateLevel(level:ImpossibleLevel) {
    if(level.id) {
      return this.pb.collection("ill").update(level.id, level);
    } else {
      console.error('invalid id lol')
      return undefined
    }
  }

  deleteLevel(level:ImpossibleLevel) {
    if(level.id) {
      return this.pb.collection(`ill`).delete(level.id)
    } else {
      console.error('invalid id lol')
      return undefined
    }
  }
}
