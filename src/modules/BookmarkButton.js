"use strict";
/**
 * BookmarkButton
 * 商品ページ、一覧ページに表示するブックマーク追加・削除ボタン
 */
import bookmark from '@/modules/Bookmark'

export class BookmarkButton {
  constructor(item) {
    this.item = item;
    this.isBookmarked = false;
  }
  async create(){
    const $elem = await this.#createElem();
    this.#addEvent($elem);
    return $elem;
  }
  // ブックマークボタンのDOM
  async #createElem(){
    const $elem = document.createElement('div');
    $elem.classList.add('bookmark-button');

    const item = await bookmark.find(this.item);
    console.log(item);
    if(item){
      $elem.classList.add('active');
      this.isBookmarked = true;
    }else{
      $elem.classList.remove('active');
      this.isBookmarked = false;
    }
    return $elem;
  }
  // ボタンをクリックでブックマーク状態をtoggleする
  #addEvent($elem){
    let isBusy = false;
    $elem.addEventListener('click', async e=>{
      if(isBusy) return;// 連打対策
      isBusy = true;

      console.log(this.item);
      if(this.isBookmarked){
        await bookmark.remove(this.item);
        $elem.classList.remove('active');
        this.isBookmarked = false;
      }else{
        await bookmark.add(this.item);
        $elem.classList.add('active');
        this.isBookmarked = true;
      }
      isBusy = false;
    });
  }
}