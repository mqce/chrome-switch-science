"use strict";

import '@/css/style.scss';

import config from '@/modules/Config'
import bookmark from '@/modules/Bookmark'
import { PageProduct } from '@/pages/PageProduct'
import { PageCollection } from '@/pages/PageCollection'

window.addEventListener('DOMContentLoaded', (event) => {
  main();
});

async function main(){
  await config.load();
  console.log(config.items);

  showBookmark();

  // product page
  if(document.body.classList.contains('template-product')){
    const pageProduct = new PageProduct();
    pageProduct.init();
  }

  // collection page
  if(document.body.classList.contains('template-collection')){
    const pageCollection = new PageCollection();
    pageCollection.init();
  }
}

async function showBookmark(){
  // カートの左にブックマークアイコンを挿入
  const $parent = document.querySelector('.site-header-right');
  const $cart = $parent.querySelector('.site-header-cart');
  if($parent, $cart){
    const $elem = await bookmark.load();
    $parent.insertBefore($elem, $cart);
  }
}
