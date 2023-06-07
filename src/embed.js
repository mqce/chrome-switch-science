// content.jsからはwindowオブジェクトが取得できないのでembedから送る
// 参考: https://zenn.dev/ellreka/articles/799632c02d1cb5

window.addEventListener('message', (event) => {
  if(
    event.source == window && 
    event?.data?.type === 'FROM_CONTENT'
  ){
    postPageflyData();
  }
}, false);

postPageflyData();

function postPageflyData(){
  const data = JSON.stringify(window.__pageflyProducts);
  return window.postMessage(
    { type: 'FROM_EMBED', data },
    'https://www.switch-science.com'
  );
}