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

  parseItemData : (data) => {
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





