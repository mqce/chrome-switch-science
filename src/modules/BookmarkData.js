"use strict";
/*
  別タブでデータが変更されている可能性があるので、
  改変する際は必ず先にstorage.localからロードする
*/
import Storage from './StorageLocal.js'

const storage = new Storage();

export class BookmarkData {
  constructor() {
  }
  async load(){
    const list = await storage.get('list') || [];
    return list;
  }
  async save(list){
    await storage.set('list', list);
    return list;
  }
  async find(item){
    const list = await this.load();
    return list.find(x => x.sku === item.sku);
  }
  async add(item){
    const list = await this.load();
    const found = await this.find(item);
    if(!found){
      list.push(item);
      await this.save(list);
    }
    return list;
  }
  async remove(item){
    let list = await this.load();
    list = list.filter(x => x.sku !== item.sku);
    await this.save(list);
    return list;
  }
  async clear(){
    const empty = [];
    await this.save(empty);
    return empty;
  }
}

const bookmarkData = new BookmarkData();
export default bookmarkData;
