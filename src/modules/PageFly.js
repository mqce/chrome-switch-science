"use strict";


const PageFly = {
  // 初回のデータ取得
  getItemsDataFirstTime : async () => {
    const jsonString = await embedJsAndRecievePageflyData();
    const data = JSON.parse(jsonString);
    return data;
  },

  // 二回目以降のデータ取得
  getItesmData : async () => {
    const jsonString = await requestPageflyData();
    const data = JSON.parse(jsonString);
    return data;
  },

  /*
    window.__pageflyProducts["7790545928390"] = {
      id: 7790545928390,
      handle: "9010",
      title: "M5Stack Basic V2.7",
      type: "",
      url: "\/products\/9010",
      vendor: "スイッチサイエンス",
      variants: [{"id":42698454925510,"title":"Default Title","option1":"Default Title","option2":null,"option3":null,"sku":"9010","requires_shipping":true,"taxable":true,"featured_image":null,"available":true,"name":"M5Stack Basic V2.7","public_title":null,"options":["Default Title"],"price":542300,"weight":0,"compare_at_price":null,"inventory_management":"shopify","barcode":"4570056892882","requires_selling_plan":false,"selling_plan_allocations":[],"quantity_rule":{"min":1,"max":null,"increment":1}}],
      options: ["Title"],
      media: [{"alt":null,"id":28216302731462,"position":1,"preview_image":{"aspect_ratio":1.0,"height":800,"width":800,"src":"https:\/\/cdn.shopify.com\/s\/files\/1\/0514\/0719\/2262\/products\/86c165da-8280-4024-97a0-a04c15977c09.jpg?v=1686106227"},"aspect_ratio":1.0,"height":800,"media_type":"image","src":"https:\/\/cdn.shopify.com\/s\/files\/1\/0514\/0719\/2262\/products\/86c165da-8280-4024-97a0-a04c15977c09.jpg?v=1686106227","width":800},{"alt":null,"id":28216302764230,"position":2,"preview_image":{"aspect_ratio":1.0,"height":800,"width":800,"src":"https:\/\/cdn.shopify.com\/s\/files\/1\/0514\/0719\/2262\/products\/5ed34d12-77ac-4b0c-aa2d-d213003e2273.jpg?v=1686106227"},"aspect_ratio":1.0,"height":800,"media_type":"image","src":"https:\/\/cdn.shopify.com\/s\/files\/1\/0514\/0719\/2262\/products\/5ed34d12-77ac-4b0c-aa2d-d213003e2273.jpg?v=1686106227","width":800},{"alt":null,"id":28216302796998,"position":3,"preview_image":{"aspect_ratio":1.0,"height":800,"width":800,"src":"https:\/\/cdn.shopify.com\/s\/files\/1\/0514\/0719\/2262\/products\/322c9970-b59a-4191-806d-5f40bdf4a4d8.jpg?v=1686106227"},"aspect_ratio":1.0,"height":800,"media_type":"image","src":"https:\/\/cdn.shopify.com\/s\/files\/1\/0514\/0719\/2262\/products\/322c9970-b59a-4191-806d-5f40bdf4a4d8.jpg?v=1686106227","width":800}],
      has_only_default_variant: true,
      options_with_values: [{"name":"Title","position":1,"values":["Default Title"]}],
      selected_variant: null,
      selected_or_first_available_variant: {"id":42698454925510,"title":"Default Title","option1":"Default Title","option2":null,"option3":null,"sku":"9010","requires_shipping":true,"taxable":true,"featured_image":null,"available":true,"name":"M5Stack Basic V2.7","public_title":null,"options":["Default Title"],"price":542300,"weight":0,"compare_at_price":null,"inventory_management":"shopify","barcode":"4570056892882","requires_selling_plan":false,"selling_plan_allocations":[],"quantity_rule":{"min":1,"max":null,"increment":1}},
      tags: ["avail:listable","avail:orderable","cat:ステータス","cat:ステータス_新商品","cat:センサ","cat:センサ_カラー","cat:チップ\/アーキテクチャ","cat:チップ\/アーキテクチャ_ESP32","cat:ディスプレイ","cat:ディスプレイ_LCD","cat:ディスプレイ_グラフィック","cat:ディスプレイ_ディスプレイ","cat:ネットワーク","cat:ネットワーク_Bluetooth Low Energy（BLE）","cat:ネットワーク_無線LAN","cat:ブランド小分類","cat:ブランド小分類_M5 コントローラ","cat:プログラミング言語\/OS","cat:プログラミング言語\/OS_Arduino言語","cat:プログラミング言語\/OS_MicroPython \/ CircuitPython","cat:プログラミング言語\/OS_UIFlow","cat:メーカー\/ブランド","cat:メーカー\/ブランド_M5Stack","cat:純正品\/互換機（本体）","cat:純正品\/互換機（本体）_純正品","cat:開発ボード","cat:開発ボード_マイコンボード","dsc:cop:rate:1:10.0000","dsc:rea:rate:1:15.0000","dsc:reb:rate:1:10.0000","在庫_あり"],
      template_suffix: null,
      featured_image: "\/\/cdn.shopify.com\/s\/files\/1\/0514\/0719\/2262\/products\/86c165da-8280-4024-97a0-a04c15977c09.jpg?v=1686106227",
      featured_media: {"alt":null,"id":28216302731462,"position":1,"preview_image":{"aspect_ratio":1.0,"height":800,"width":800,"src":"https:\/\/cdn.shopify.com\/s\/files\/1\/0514\/0719\/2262\/products\/86c165da-8280-4024-97a0-a04c15977c09.jpg?v=1686106227"},"aspect_ratio":1.0,"height":800,"media_type":"image","src":"https:\/\/cdn.shopify.com\/s\/files\/1\/0514\/0719\/2262\/products\/86c165da-8280-4024-97a0-a04c15977c09.jpg?v=1686106227","width":800},
      images: ["\/\/cdn.shopify.com\/s\/files\/1\/0514\/0719\/2262\/products\/86c165da-8280-4024-97a0-a04c15977c09.jpg?v=1686106227","\/\/cdn.shopify.com\/s\/files\/1\/0514\/0719\/2262\/products\/5ed34d12-77ac-4b0c-aa2d-d213003e2273.jpg?v=1686106227","\/\/cdn.shopify.com\/s\/files\/1\/0514\/0719\/2262\/products\/322c9970-b59a-4191-806d-5f40bdf4a4d8.jpg?v=1686106227"],
      quantity: ["42698454925510:663"]
    };
  */
  parseItemData : (data) => {
    function parseQty(qtyData){
      const arr = qtyData.split(':');
      return parseInt(arr[1]);
    }
    let item = null;
    try{
      item = {
        id: data.variants[0].id,
        name: data.title,
        sku: data.handle,
        price: data.variants[0].price / 100,
        url: data.url,
        image: data.featured_image,
        available: data.variants[0].available,
        quantity: parseQty(data.quantity[0])
      }
    }catch(e){}
    return item;
  }
};

export default PageFly;


// 初回のデータ取得
// embed.jsを埋め込んでレスポンスを待つ
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
        resolve(event.data.data);
      }
    }, { once : true });// 一回だけ
  });
};

// 都度データ取得
// postMessage して data を受け取る
function requestPageflyData(){
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





