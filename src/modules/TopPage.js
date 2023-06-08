"use strict";

import { BookmarkButton } from '@/modules/BookmarkButton'
import { formatNumber } from '@/modules/Util'

const sanitizer = new Sanitizer();// https://developer.mozilla.org/ja/docs/Web/API/Element/setHTML

/*
  商品の価格とidがほしい
  → shopify plugin Pagefly のデータが必要
  → contents.jsからはwindowオブジェクトが取得できないのでembedから送ってもらう
*/
export default async function initTopage(){
  // 表示されている商品にお気に入りボタンを表示
  const $items = document.querySelectorAll('.pf-product-form');
  if($items){
    const data = await getItemsDataFirstTime();
    modifyItemDisplay($items, data);
  }

  // "LOAD MORE" で表示される商品にお気に入りボタンを表示
  const $parents = document.querySelectorAll('[data-pf-type="ProductList"]');
  if($parents){
    // 複数のタブがある
    $parents.forEach($parent => modifyItemDisplayAfterMutation($parent));
  }
}

// 初回のデータ取得
async function getItemsDataFirstTime(){
  const jsonString = await embedJsAndRecievePageflyData();
  const data = JSON.parse(jsonString);
  return data;
}

// 二回目以降のデータ取得
async function getItesmData(){
  const jsonString = await requestPageflyData();
  const data = JSON.parse(jsonString);
  return data;
}


// 初回のデータ取得はembed.jsを埋め込んでレスポンスを待つ
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

// 都度データ取得
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
      'https://www.switch-science.com'
    );
  });
}



function parseItemData(data){
  let item = null;
  try{
    item = {
      id: data.variants[0].id,
      name: data.title,
      sku: data.handle,
      price: data.variants[0].price / 100,
      url: data.url,
      image: data.featured_image,
      available: data.variants[0].available
    }
  }catch(e){}
  return item;
}

/*
  トップページの商品一覧にブックマークボタンを表示
*/
async function modifyItemDisplay($items, data){
  $items.forEach($item => {
    if($item.querySelector('.bookmark-button')){
      return;
    }
    const id = $item.dataset.productid;
    const item = parseItemData(data[id]);
    if(item){
      showPrice($item, item);
      appendBookmarkButton($item, item);
    }
  });
}

function showPrice($item, item){
  const html_soldout = `<span class="productitem__badge productitem__badge--soldout" style="position:relative;top:-5px;">売り切れ</span>`;
  const html_price = `
  <div class="price productitem__price">
    <div class="price__current price__current--emphasize">
      <span class="money" style="font-size:1.375rem">&yen; ${formatNumber(item.price)}</span>
    </div>
  </div>
  `;
  const html = item.available ? html_price : html_soldout + html_price;
  const $elem = document.createElement('div');
  const $title = $item.querySelector('h3');
  $elem.setHTML(html, sanitizer);
  console.log($item,$elem,$title);
  $item.querySelector('[data-pf-type="Column"]').insertBefore($elem, $title);
}

async function appendBookmarkButton($parent, item){
  const button = new BookmarkButton(item);
  const $button = await button.create();
  $parent.appendChild($button);
}






// 後から動的に追加される要素にボタンを追加
function modifyItemDisplayAfterMutation($parent){
  const observer = new MutationObserver(async (records) => {
    // observer.disconnect();
    // 追加された商品にボタンを追加
    const $items = $parent.querySelectorAll('.pf-product-form');

    const data = await getItesmData();
    modifyItemDisplay($items, data);
  });
  // DOM変更を監視
  observer.observe($parent, {
    childList: true,
  });
}

