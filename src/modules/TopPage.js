"use strict";

import { BookmarkButton } from '@/modules/BookmarkButton'

/*
  商品の価格とidがほしい
  → shopify plugin Pagefly のデータが必要
  → contents.jsからはwindowオブジェクトが取得できないのでembedから送ってもらう
*/
function embedJsAndRecievePageflyData(){
  // 埋め込む
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('embed.js');
  document.head.appendChild(script);

  // embed.jsのロード待ち
  return new Promise(resolve => {
    window.addEventListener('message', (event) => {
      if(
        event.source == window && 
        event?.data?.type === 'FROM_EMBED'
      ){
        console.log('embed loaded');
        resolve(event.data.data);
      }
    }, { once : true });
  });
}

/* shopify plugin：Pagefly のデータを取得する */
function requestPageflyData(){
  // postMessage して data を受け取る
  return new Promise(resolve => {
    window.addEventListener('message', (event) => {
      if(
        event.source == window && 
        event?.data?.type === 'FROM_EMBED'
      ){
        resolve(event.data.data);
      }
    }, false);
    window.postMessage(
      { type: 'FROM_CONTENT' },
      '*'
    );
  });

}

export default async function initTopage(){
  const jsonString = await embedJsAndRecievePageflyData();

  const $items = document.querySelectorAll('.pf-product-form');
  if($items){
    addButtons($items, jsonString);
  }

  const $parent = document.querySelector('[data-pf-type="ProductList"]');
  if($parent){
    addButtonsAfterMutation($parent);
  }
}

/*
  トップページの商品一覧にブックマークボタンを表示する
*/
async function addButtons($items, jsonString){
  // 価格とidを得るのに window.__pageflyProducts が必要
  if(!jsonString) jsonString = await requestPageflyData();
  const data = JSON.parse(jsonString)
  console.log('PageflyData:', data);
  $items.forEach($item => {
    if($item.querySelector('.bookmark-button')){
      return;
    }
    try{
      const id = $item.dataset.productid;
      const item = {
        id: data[id].variants[0].id,
        name: data[id].title,
        sku: data[id].handle,
        price: data[id].variants[0].price / 100,
        url: data[id].url,
        image: data[id].featured_image
      }
      appendBookmarkButton($item, item);
    }catch(e){}
  });
}


// 後から動的に追加される要素にボタンを追加
function addButtonsAfterMutation($parent){
  const observer = new MutationObserver(records => {
    // observer.disconnect();
    // 追加された商品にボタンを追加
    const $items = $parent.querySelectorAll('.pf-product-form');
    addButtons($items);
  });
  // DOM変更を監視
  observer.observe($parent, {
    childList: true,
  });
}

async function appendBookmarkButton($parent, item){
  const button = new BookmarkButton(item);
  const $button = await button.create();
  $parent.appendChild($button);
}