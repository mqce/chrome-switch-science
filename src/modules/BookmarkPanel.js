"use strict";

import Storage from './StorageLocal.js'
import { formatNumber } from '@/modules/Util'

const sanitizer = new Sanitizer();// https://developer.mozilla.org/ja/docs/Web/API/Element/setHTML
const storage = new Storage();

const CLASSNAME = 'ssbm';
const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 'auto';
const html = `
<header>
  <div class="ssbm-header-icon"></div>
  <div class="ssbm-header-length"></div>
</header>
<div class="ssbm-body">
  <div>
    <div class="ssbm-list">
      <ul></ul>
    </div>
    <div class="ssbm-empty">
      <span class="ssbm-add-icon"></span>をクリックしてブックマーク
    </div>
    <footer>
      <button class="ssbm-clear-button">クリア</button>
      <button class="ssbm-cart-button">更新</button>
    </footer>
  </div>
</div>
`;

export class BookmarkPanel {
  constructor(bookmark) {
    this.bookmark = bookmark;
    this.width = DEFAULT_WIDTH;
    this.height = DEFAULT_HEIGHT;

    // ページ離脱前にサイズを保存
    window.addEventListener('beforeunload', async (e)=>{
      e.preventDefault();
      await this.#saveBodySize();
      e.returnValue = '';
    });
  }
  // chrome.storageに保存されているデータをロードしてリストDOMを生成
  async init(list){

    // DOMを初期化
    this.#initDOM();

    // DOM更新
    this.update(list);

    // サイズをロードして適用
    await this.#loadBodySize();
    this.#setBodySize();

    return this.$elem;
  }

  #initDOM(){
    // DOMを初期化
    this.$elem = document.createElement('div');
    this.$elem.classList.add(CLASSNAME);
    this.$elem.setHTML(html, sanitizer);
    this.$body = this.$elem.querySelector('.ssbm-body');
    this.#addEvents();
  }
  update(list){
    // 件数バッジを更新
    this.$elem.querySelector('.ssbm-header-length').textContent = list.length;

    // リストが空の場合
    if(list.length === 0){
      // デフォルトのサイズに戻す
      this.#resetBodySize();
      this.$elem.classList.add('ssbm-is-empty');
    }else{
      this.$elem.classList.remove('ssbm-is-empty');
    }

    // リストを更新
    const $ul = this.$elem.querySelector('.ssbm-list>ul');
    $ul.innerHTML = "";
    list.map(item=>{
      const $li = this.#li(item);
      $ul.appendChild($li);
    });
  }
  #resetBodySize(){
    this.width = this.DEFAULT_WIDTH;
    this.height = this.DEFAULT_HEIGHT;
    this.#setBodySize();
  }
  #setBodySize(){
    this.$body.style.width = this.width === 'auto' ? 'auto' : this.width + 'px';
    this.$body.style.height = this.height === 'auto' ? 'auto' : this.height + 'px';
  }
  async #loadBodySize(){
    this.width = await storage.get('bodyWidth') || this.DEFAULT_WIDTH;
    // this.height = await storage.get('bodyHeight') || this.DEFAULT_HEIGHT;
    // heightはautoが良い
    this.height = this.DEFAULT_HEIGHT;
  }
  async #saveBodySize(){
    await storage.set('bodyWidth', this.width);
    // await storage.set('bodyHeight', this.height);
  }

  #addEvents(){
    // パネル開閉
    this.$elem.querySelector('header').addEventListener('click', e => {
      this.$body.classList.toggle('ssbm-is-active');
    });

    // リストをクリア
    this.$elem.querySelector('.ssbm-clear-button').addEventListener('click', async e=>{
      if(confirm('リストをクリアします')){
        await this.bookmark.clear();
        return true;
      }else{
        e.preventDefault();
      }
    });

    // 更新
    let isBusy = false;
    this.$elem.querySelector('.ssbm-cart-button').addEventListener('click', async e => {
      if(confirm('最新の情報を取得してリストを更新します。\nブックマークが多いと時間がかかる場合があります。')){
        if(isBusy) return;// 連打対策
        isBusy = true;
        await this.bookmark.reload();
        isBusy = false;
        return true;
      }else{
        e.preventDefault();
      }
    });

    this.#attachResizeEvent();
  }
  // ssbm-bodyのcss-resizeを拾う
  #attachResizeEvent(){
    const $elem = this.$body;
    const observer = new MutationObserver(() => {
      this.width = $elem.getBoundingClientRect().width
      this.height = $elem.getBoundingClientRect().height
    })
    observer.observe($elem, {
      attriblutes: true,
      attributeFilter: ["style"]
    })
  }
  // 商品一件分のHTMLを生成
  #li(item){
    const active = item.available ? 'ssbm-active':'';
    const $li = document.createElement('li');
    const html = `
    <div class="ssbm-item-remove" title="削除"></div>
    <img class="ssbm-item-thumb" src="${item.image}">
    <a href="${item.url}" class="ssbm-item-name" title="${item.name}">${item.name}</a>
    <span class="ssbm-item-price ${active}">&yen;${formatNumber(item.price)}</span>
    `;
    $li.setHTML(html, sanitizer);
  
    // 削除ボタン
    $li.querySelector('.ssbm-item-remove').addEventListener('click', async e=>{
      this.bookmark.remove(item);
    });
    return $li;
  }

}
