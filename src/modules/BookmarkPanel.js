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
  <form method="POST" action="/catalog/cart/cart.aspx">
    <input type="hidden" name="input_type" value="True">
    <div class="ssbm-list">
      <ul></ul>
    </div>
    <div class="ssbm-empty">
      <span class="ssbm-add-icon"></span>をクリックしてブックマーク
    </div>
    <footer>
      <button type="button" class="ssbm-clear-button">クリア</button>
      <button type="submit" class="ssbm-cart-button">全てかごに入れる</button>
    </footer>
  </form>
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

    // カートに入れる
    this.$elem.querySelector('.ssbm-cart-button').addEventListener('click', e => {
      if(confirm('全てカートに入れます')){
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
    const price = formatNumber(item.price);
    const $li = document.createElement('li');
    const html = `
    <input type="hidden" name="goods" value="${item.id}">
    <input type="hidden" name="${item.id}_qty" value="1">
    <div class="ssbm-item-remove" title="削除"></div>
    <img class="ssbm-item-thumb" src="${item.image}">
    <a href="${item.url}" class="ssbm-item-name" title="${item.name}">${item.name}</a>
    <span class="ssbm-item-price">&yen;${price}</span>
    <span class="ssbm-item-cart" title="カートに入れる"></span>
    `;
    $li.setHTML(html, sanitizer);
  
    // 削除ボタン
    $li.querySelector('.ssbm-item-remove').addEventListener('click', async e=>{
      this.bookmark.remove(item);
    });

    // カートに入れるボタン
    $li.querySelector('.ssbm-item-cart').addEventListener('click', async e=>{
      this.#addSingleItemToCart(e.target, item);
    });  
    return $li;
  }
  async #addSingleItemToCart($elem, id){
    /*
    $elem.classList.remove('ssbm-done');
    try {
      const url = '/catalog/cart/cart.aspx';
      const data = new FormData();
      data.append('goods', id);
      data.append(id + '_qty', 1);
      const response = await axios.post(url, data);

      // カートに入れた動きをつける
      if(response.status == 200){
        $elem.classList.add('ssbm-done');
      }

      // カートページにいる場合はリロードする
      if(location.href.includes(url)){
        location.href = url;
      }
    } catch (e) {
      console.error(e);
    }
    */
  }
}