"use strict";

import '@/css/style.scss';

import config from '@/modules/Config'
/*
import bookmark from '@/modules/Bookmark'
import cart from '@/modules/Cart'
import header from '@/modules/Header'
*/

import { PageProduct } from '@/pages/PageProduct'
/*
import { PageList } from '@/pages/PageList'
import { PageBookmark } from '@/pages/PageBookmark'
*/

window.addEventListener('DOMContentLoaded', (event) => {
  main();
});

async function main(){

  await config.load();
  console.log(config.items);

/*
  await bookmark.load();
  header.updateBookmarkCount(bookmark.length);

  await cart.load();
  header.updateCartCount(cart.length);
*/

  // 詳細ページ
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

  // お気に入りページ
  if(location.href.includes('/catalog/customer/bookmark.aspx')){
    const pageBookmark = new PageBookmark();
    pageBookmark.init();
  }
  */
}
