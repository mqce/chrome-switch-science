"use strict";

import { BookmarkButton } from '@/modules/BookmarkButton'
import { CartButton } from '@/modules/CartButton'
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
      this.appendBookmarkAndCartButtons($parent, item);
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
        this.appendBookmarkAndCartButtons($parent, item);
      }
    })
  }

  appendBookmarkAndCartButtons($parent, item){
    const $elem = document.createElement('div');
    $elem.classList.add('action-buttons');
    $parent.appendChild($elem);
    this.appendBookmarkButton($elem, item);
    this.appendCartButton($elem, item);
  }

  appendBookmarkButton($parent, item){
    const button = new BookmarkButton(item);
    const $button = button.create();
    $parent.appendChild($button);
  }

  appendCartButton($parent, item){
    const button = new CartButton(item);
    const $button = button.create();
    $parent.appendChild($button);
  }

}