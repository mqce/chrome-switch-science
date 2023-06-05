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
        id : this.getId(),
        url : this.getUrl(),
        price : this.getPrice(),
        image : this.getImage(),
      };
    }catch(e){

    }
    return item;
  }
  getName(){
    const text = this.$content.querySelector('.product-title')?.textContent;
    return text.trim();
  }
  getId(){
    const text = this.$content.querySelector('.product-sku span')?.textContent;
    return text.trim();
  }
  getUrl(){
    return '//www.switch-science.com/products/' + this.getId();
  }
  getPrice(){
    let price = 0;
    const text = this.$content.querySelector('.price span')?.textContent;
    const match = text.trim().match(/[¥￥]([0-9,]+)$/);
    if(match){
      price = parseInt(match[1].replace(/,/g, ''));
    }
    return price;
  }
  getImage(){
    return this.$content.querySelector('.product-gallery--image')?.dataset.zoom;
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
  getId(){
    let id = '';
    const url = this.$content.querySelector('.productitem--title a')?.href;
    if(url){
      id = url.replace(/^.+products\/(\d+)/, '$1');
    }
    return id;
  }
  getImage(){
    return this.$content.querySelector('.productitem--image img')?.src;
  }
}
export function itemScraperGridItems($content){
  const scraper = new ItemScraperGridItems($content);
  return scraper.exec();
}