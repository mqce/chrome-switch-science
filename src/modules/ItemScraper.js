"use strict";

class ItemScraper {
  constructor($content) {
    this.$content = $content;
  }
  exec(){
    let item = null;
    try{
      item = {
        name : this.getName(),
        // id : this.getId(),
        sku : this.getSku(),
        url : this.getUrl(),
        price : this.getPrice(),
        image : this.getImage(),
        available : this.getAvailability(),
      };
    }catch(e){
    }
    return item;
  }
  getName(){
    const text = this.$content.querySelector('.product-title').textContent;
    return text.trim();
  }
  /*
  getId(){
    return this.$content.querySelector('.variants-ui').value;
  }
  */
  getSku(){
    const text = this.$content.querySelector('.product-sku span').textContent;
    return text.trim();
  }
  getUrl(){
    return '/products/' + this.getSku();
  }
  getPrice(){
    let price = 0;
    const text = this.$content.querySelector('.price__current .money').textContent;
    const match = text.trim().match(/[¥￥]([0-9,]+)$/);
    if(match){
      price = parseInt(match[1].replace(/,/g, ''));
    }
    return price;
  }
  getImage(){
    return this.$content.querySelector('.product-gallery--image img').src;
  }
  getAvailability(){
    // soldout表記が無い→available
    const $item = this.$content.querySelector('.product__badge--soldout');
    return $item === null;
  }
}
export function itemScraper($content){
  const scraper = new ItemScraper($content);
  return scraper.exec();
}

/*
  商品ページ下部の「関連商品」や「おすすめ」、一覧ページに出てくる商品
*/
class ItemScraperGridItems extends ItemScraper {
  getName(){
    const text = this.$content.querySelector('.productitem--title a')?.textContent;
    return text.trim();
  }
  /*
  getId(){
    return this.$content.querySelector('[data-quick-buy]').dataset.variantId;
  }
  */
  getSku(){
    let sku = '';
    const url = this.$content.querySelector('.productitem--title a')?.href;
    if(url){
      sku = url.replace(/^.+products\/(\d+).*?$/, '$1');
    }
    return sku;
  }
  getImage(){
    return this.$content.querySelector('.productitem--image img')?.src;
  }
  getAvailability(){
    const $item = this.$content.querySelector('.productitem__badge--soldout');
    return $item === null;
  }
}
export function itemScraperGridItems($content){
  const scraper = new ItemScraperGridItems($content);
  return scraper.exec();
}