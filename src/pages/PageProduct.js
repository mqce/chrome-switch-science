"use strict";

import { BookmarkButton } from '@/modules/BookmarkButton'
import { itemScraper, itemScraperRelated } from '@/modules/ItemScraper'

export class PageProduct {
  constructor() {
  }
  init(){
    // 商品データをscrape
    const item = itemScraper(document.body);

    console.log(item);

    // ブックマークに追加するボタンを挿入
    this.addButton(item);

    // ブックマークに追加するボタンを挿入(関連商品)
    // this.addButtonsRelated();

  }
  // SKUの横にボタンを追加
  addButton(item){
    if(item){
      const $parent = document.querySelector('.product-main .product-sku');
      this.appendBookmarkButton($parent, item);
    }
  }
  // 関連商品にボタンを追加
  addButtonsRelated(){
    const $items = document.querySelectorAll('.kanren form>table');
    $items.forEach($item => {
      // 商品データをscrape
      const item = itemScraperRelated($item);

      // 追加ボタンを描画
      if(item){
        const $parent = $item.querySelector('h6');
        this.appendBookmarkButton($parent, item);
      }
    })
  }

  async appendBookmarkButton($parent, item){
    const button = new BookmarkButton(item);
    const $button = await button.create();
    $parent.appendChild($button);
  }
}