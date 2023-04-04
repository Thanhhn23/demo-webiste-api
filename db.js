const puppeteer = require('puppeteer-core');
const { Client } = require('pg');
const path = require('path');
const { trim } = require('lodash');

async function crawl() {
  const browser = await puppeteer.launch({
    executablePath: '/opt/google/chrome/google-chrome'
    
  });
  const page = await browser.newPage();

  // Truy cập trang web Tiki
  await page.goto('https://tiki.vn/giay-dep-nu/c1703');

  // Lấy danh sách sản phẩm từ trang web
  const products = await page.evaluate(() => {
    const productList = [];
    const productNodes = document.querySelectorAll('.product-item');   
    console.log(productNodes) 

    for (let node of productNodes) {   
      const image = node.querySelector('img')   
      const product = {
        // name: node.querySelector('.name').innerText.trim(),
        // price: parseInt(node.querySelector('.price-discount__price').innerText.replace(/\D/g, '')),
        // url: node.href,
        image_url: image.getAttribute('src')
      };
      productList.push(product);
    }

    return productList;
    
  });
   console.log(products);
  

  // Insert dữ liệu sản phẩm vào database
  // const client = new Client({
  //   user: 'thanh',
  //   host: 'localhost',
  //   database: 'mydatabase',
  //   password: 'thanh',
  //   port: 5432
  // });

  // await client.connect();

  // for (let product of products) {
  //   await client.query(`INSERT INTO products(name, price, url) VALUES($1, $2, $3)`, [product.name, product.price, product.url]);
  // }

  // await client.end();

  // await browser.close();
}

crawl();
