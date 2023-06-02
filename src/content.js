"use strict";

import '@/css/style.scss';

import config from '@/modules/Config'
import bookmark from '@/modules/Bookmark'
import { PageProduct } from '@/pages/PageProduct'
/*
import { PageList } from '@/pages/PageList'
*/

window.addEventListener('DOMContentLoaded', (event) => {
  main();
});

async function main(){

  await config.load();
  console.log(config.items);

  showBookmarkPanel();

  // product page
  if(document.body.classList.contains('template-product')){
    const pageProduct = new PageProduct();
    pageProduct.init();
  }

  /*
  // 一覧ページ
  if(document.body.classList.contains('template-collection')){
    const pageList = new PageList();
    pageList.init();
  }
  */
}

async function showBookmarkPanel(){
  const $elem = await bookmark.load();
  document.body.appendChild($elem);
}
