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
    let text = this.$content.querySelector('.product-title')?.textContent;
    return text.trim();
  }
  getId(){
    let text = this.$content.querySelector('.product-sku span')?.textContent;
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
  商品ページ下部の「関連商品」や「おすすめ」に出てくる商品
*/
class ItemScraperRelated extends ItemScraper {
  getName(){
    return this.$content.querySelector('.productitem--title a')?.textContent;
  }
  getId(){
    let id = '';
    const url = this.$content.querySelector('.productitem--title a')?.href;
    if(url){
      id = url.replace(/^.+\/(.+)$/, '$1');
    }
    return id;
  }
  getImage(){
    return this.$content.querySelector('.productitem--image img')?.src;
  }
}
export function itemScraperRelated($content){
  const scraper = new ItemScraperRelated($content);
  return scraper.exec();
}

/*
  商品一覧ページ
*/
class ItemScraperListPage extends ItemScraper {
  getName(){
    return this.$content.querySelector('.thumbox_pc .goods_name_')?.textContent;
  }
  getId(){
    let id = '';
    const src = this.$content.querySelector('.thumbox_img img')?.src;
    const match = src.match(/\/([^\/]+)\.\w+?$/);
    if(match){
      id = match[1];
    }
    return id;
  }
  getUrl(){
    return this.$content.querySelector('.goods_name_')?.href;
  }
  getPrice(){
    const elems = this.$content.querySelectorAll(".f14b");
    return this.searchPriceFromElements(elems);
  }
  getImage(){
    return this.$content.querySelector('.thumbox_img img')?.src;
  }
}
export function itemScraperListPage($content){
  const scraper = new ItemScraperListPage($content);
  return scraper.exec();
}
