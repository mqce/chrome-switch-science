"use strict";

import '@/css/style.scss';

import config from '@/modules/Config'
import bookmark from '@/modules/Bookmark'
import TopPage from '@/modules/TopPage'
import { BookmarkButton } from '@/modules/BookmarkButton'
import { itemScraper, itemScraperGridItems } from '@/modules/ItemScraper'

window.addEventListener('DOMContentLoaded', () => {
  main();
});

async function main(){
  await config.load();
  console.log(config.items);

  // toppage
  if(document.body.classList.contains('template-index')){
    TopPage.init();
  }

  // header
  showBookmarkIcon();

  // bookmark buttons
  addBookmarkButtons();
}

// カートの左にブックマークアイコンを挿入
async function showBookmarkIcon(){
  const $parent = document.querySelector('.site-header-right');
  const $cart = $parent.querySelector('.site-header-cart');
  if($parent && $cart){
    const $elem = await bookmark.load();
    $parent.insertBefore($elem, $cart);
  }
}

function addBookmarkButtons(){
  let $item, $items, $parent;

  // 商品詳細ページ
  $item = document.querySelector('.product--container');
  if($item){
    addButtonProductPage($item);
  }

  // 一覧ページ、商品ページの関連商品
  $items = document.querySelectorAll('.productgrid--item');
  if($items){
    addButtonsProductGrid($items);
  }


  // おすすめ
  $parent = document.querySelector('.product-recommendations--section');
  if($parent){
    addButtonsAfterMutation($parent);
  }
  
  // 閲覧履歴
  $parent = document.querySelector('.product-recently-viewed__content');
  if($parent){
    addButtonsAfterMutation($parent);
  }
}

// 商品詳細ページにボタンを表示
function addButtonProductPage($item){
  const item = itemScraper($item);
  if(item){
    // SKUの横にボタンを追加
    const $parent = document.querySelector('.product-main .product-sku');
    if($parent){
      appendBookmarkButton($parent, item);
    }
  }
}

// 一覧と関連商品にボタンを表示
function addButtonsProductGrid($items){
  $items.forEach($item => {
    const item = itemScraperGridItems($item);
    if(item){
      appendBookmarkButton($item, item);
    }
  })
}

// 後から動的に追加される要素にボタンを追加
function addButtonsAfterMutation($parent){
  const observer = new MutationObserver(records => {
    observer.disconnect();
    // DOMが追加されたらボタンを追加
    const $items = $parent.querySelectorAll('.productgrid--item');
    addButtonsProductGrid($items);
  });
  // DOM変更を監視
  observer.observe($parent, {
    childList: true,
    subtree : true,
  });
}

async function appendBookmarkButton($parent, item){
  const button = new BookmarkButton(item);
  const $button = await button.create();
  $parent.appendChild($button);
}