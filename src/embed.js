// contents.jsからはwindowオブジェクトが取得できないのでembedから送る
window.addEventListener('message', (event) => {
  if(
    event.source == window && 
    event?.data?.type === 'FROM_CONTENT'
  ){
    const data = JSON.stringify(window.__pageflyProducts);
    window.postMessage(
      { type: 'FROM_EMBED', data },
      '*'
    );
  }
}, false);

const data = JSON.stringify(window.__pageflyProducts);
window.postMessage(
  { type: 'FROM_EMBED', data },
  '*'
);
