"use strict";

import axios from 'axios';
import bookmarkData from '@/modules/BookmarkData'
import { BookmarkPanel } from '@/modules/BookmarkPanel'
import { itemScraper } from '@/modules/ItemScraper'

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
  find(item){
    return bookmarkData.find(item);
  }
  // 全データを各ページから再取得する
  async reload(){
    
    let list = await bookmarkData.load() || [];
    const promiseList = list.map(item => getItemDataFrom(item.url));
    const newList = await Promise.all(promiseList);

    await bookmarkData.save(newList);
    this.panel.update(newList);
  }
}

async function getItemDataFrom(url){
  let item = null;
  const response = await axios.get(url);
  if(response.status == 200){
    const html = response.data;
    const $tmp = document.createElement('div');
    $tmp.innerHTML = html;

    const $item = $tmp.querySelector('.product--container');
    item = itemScraper($item);
  }
  return item;
}

const bookmark = new Bookmark();
export default bookmark;