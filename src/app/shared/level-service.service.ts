import { Injectable } from '@angular/core';
import { ImpossibleLevel } from './impossible-level';
import Pocketbase from 'pocketbase'

@Injectable({
  providedIn: 'root'
})
export class LevelServiceService {
  constructor(public pb: Pocketbase) {
    pb = new Pocketbase('http://127.0.0.1:8090')
  }
  
  ill_unordered:ImpossibleLevel[] = [];
  ill_ordered:ImpossibleLevel[] = [];


  getEntireLevelList() {
    return this.pb.collection('ill').getFullList()
  }

  getWholeLevelList() {
    return this.pb.collection('ill').getFullList()
  }

  async getOrderedLevelList() {
    let arr = await this.pb.collection('ill').getFullList<ImpossibleLevel>(100, { sort: '-position' })
    console.log(arr);
    return arr
  }

  async addLevel(level:ImpossibleLevel) {
    const record = await this.pb.collection("ill").create(level);
    level.id = record.id
    return await this.pb.collection("ill").update(level.id, level);
  }

  updateLevel(level:ImpossibleLevel) {
    return this.pb.collection("ill").update(level.id, level);
  }

  deleteLevel(level:ImpossibleLevel) {
    return this.pb.collection(`ill`).delete(level.id)
  }
}
