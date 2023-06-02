"use strict";

import '@/css/style.scss';

import config from '@/modules/Config'
import { ItemListPanel } from '@/modules/ItemListPanel'
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

  // Show Bookmark List
  showItemList();

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

async function showItemList(){
  const itemListPanel = new ItemListPanel();
  const $elem = await itemListPanel.load();
  document.body.appendChild($elem);
}
