"use strict";

import { BookmarkButton } from '@/modules/BookmarkButton'
import { itemScraper, itemScraperRelated } from '@/modules/ItemScraper'

export class PageProduct {
  constructor() {
  }
  init(){
    // 商品データをscrape
    const $item = document.querySelector('.product--container');
    if($item){
      const item = itemScraper($item);
      console.log(item);

      // ブックマークに追加するボタンを挿入
      this.#addButton(item);

      // 関連商品、おすすめ、閲覧履歴にボタンを追加
      this.#addButtonsRelated();
    }
  }
  // SKUの横にボタンを追加
  #addButton(item){
    if(item){
      const $parent = document.querySelector('.product-main .product-sku');
      this.#appendBookmarkButton($parent, item);
    }
  }

  // 関連商品、おすすめ、閲覧履歴にボタンを追加
  #addButtonsRelated(){
    let $parent = null;

    // 関連商品
    const $items = document.querySelectorAll('.product-section--content .productgrid--item');
    this.#addButtonsTo($items);

    // おすすめ
    $parent = document.querySelector('.product-recommendations--section');
    this.#addButtonsAfterMutation($parent);
    
    // 閲覧履歴
    $parent = document.querySelector('.product-recently-viewed__content');
    this.#addButtonsAfterMutation($parent);
  }

  #addButtonsTo($items){
    $items.forEach($item => {
      // 商品データをscrape
      const item = itemScraperRelated($item);
      if(item){
        this.#appendBookmarkButton($item, item);
      }
    })
  }

  // 後から動的に追加される要素にボタンを追加
  #addButtonsAfterMutation($parent){
    const observer = new MutationObserver(records => {
      observer.disconnect();
      // DOMが追加されたらボタンを追加
      const $items = $parent.querySelectorAll('.productgrid--item');
      this.#addButtonsTo($items);
    });
    // DOM変更を監視
    observer.observe($parent, {
      childList: true,
      subtree : true,
    });
  }
  

  async #appendBookmarkButton($parent, item){
    const button = new BookmarkButton(item);
    const $button = await button.create();
    $parent.appendChild($button);
  }
}