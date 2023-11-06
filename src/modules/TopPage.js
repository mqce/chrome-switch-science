"use strict";

import PageFly from '@/modules/PageFly'
import { BookmarkButton } from '@/modules/BookmarkButton'
import { formatNumber } from '@/modules/Util'

const TopPage = {
  /*
    商品の価格とidがほしい
    → shopify plugin Pagefly のデータが必要
    → contents.jsからはwindowオブジェクトが取得できないのでembedから送ってもらう
  */
  init : async () => {
    // 表示されている商品にお気に入りボタンを表示
    const $items = document.querySelectorAll('.pf-product-form');
    if($items){
      const data = await PageFly.getItemsDataFirstTime();
      modifyItemDisplay($items, data);
    }

    // "LOAD MORE" で表示される商品にお気に入りボタンを表示
    const $parents = document.querySelectorAll('[data-pf-type="ProductList"]');
    if($parents){
      // 複数のタブがある
      $parents.forEach($parent => modifyItemDisplayAfterMutation($parent));
    }
  }
}

export default TopPage;


// 初期に表示されている商品にブックマークボタンを表示
async function modifyItemDisplay($items, data){
  $items.forEach($item => {
    if($item.querySelector('.bookmark-button')){
      return;
    }
    try{
      const id = $item.dataset.productid;
      const item = PageFly.parseItemData(data[id]);
      if(item){
        showPrice($item, item);
        appendBookmarkButton($item, item);
      }
    }catch(e){}
  });
}

// 後から動的に追加される要素にボタンを追加
function modifyItemDisplayAfterMutation($parent){
  const observer = new MutationObserver(async () => {
    // observer.disconnect();
    // 追加された商品にボタンを追加
    const $items = $parent.querySelectorAll('.pf-product-form');

    const data = await PageFly.getItesmData();
    modifyItemDisplay($items, data);
  });
  // DOM変更を監視
  observer.observe($parent, {
    childList: true,
  });
}

function showPrice($item, item){
  const qty = item.quantity > 100 ? '100+' : item.quantity;
  // 価格と在庫を表示
  let html = `
  <div class="price productitem__price">
    <div class="price__current price__current--emphasize">
      <span class="money" style="font-size:1.375rem">&yen; ${formatNumber(item.price)}</span>
      <span class="qty" style="margin-left:8px;color:#999" title="${item.quantity}">(${qty})</span>
    </div>
  </div>
  `;
  // 売り切れの場合
  if(!item.available){
    const html_soldout = `<span class="productitem__badge productitem__badge--soldout" style="position:relative;top:-5px;">売り切れ</span>`;
    html = html_soldout + html;
  }
  const $elem = document.createElement('div');
  $elem.innerHTML = html;

  // タイトルの前に挿入
  const $title = $item.querySelector('h3');
  $item.querySelector('[data-pf-type="Column"]').insertBefore($elem, $title);
}

async function appendBookmarkButton($parent, item){
  const button = new BookmarkButton(item);
  const $button = await button.create();
  $parent.appendChild($button);
}








