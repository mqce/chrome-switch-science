"use strict";

import { BookmarkButton } from '@/modules/BookmarkButton'
import { itemScraperGridItems } from '@/modules/ItemScraper.js'

export class PageCollection {
  constructor() {
  }
  init(){
    const $items = document.querySelectorAll('.productgrid--item');
    $items.forEach($item => {
      // 商品データをscrape
      const item = itemScraperGridItems($item);
      if(item){
        // ブックマークボタンを追加
        this.#appendBookmarkButton($item, item);
      }
    })
  }

  async #appendBookmarkButton($parent, item){
    const button = new BookmarkButton(item);
    const $button = await button.create();
    $parent.appendChild($button);
  }
}