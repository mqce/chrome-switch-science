"use strict";

import bookmarkData from '@/modules/BookmarkData'
import { BookmarkPanel } from '@/modules/BookmarkPanel'

class Bookmark {
  constructor() {
  }
  async load(){
    // データをロード
    const list = await bookmarkData.load() || [];

    // Panelを初期化
    this.panel = new BookmarkPanel(this);
    await this.panel.init(list);

    return this.panel.$elem;
  }
  async clear(){
    const list = await bookmarkData.clear();
    this.panel.update(list);
  }
  async add(item){
    const list = await bookmarkData.add(item);
    this.panel.update(list);
  }
  async remove(item){
    const list = await bookmarkData.remove(item);
    this.panel.update(list);
  }
  async find(item){
    return bookmarkData.find(item);
  }
}

const bookmark = new Bookmark();
export default bookmark;