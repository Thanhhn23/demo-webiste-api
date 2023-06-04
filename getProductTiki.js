const axios = require('axios');
const { now } = require('lodash');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'thanhcong2204',
    port: '5432'
});

async function getProductTiki() {
    const response = await axios.get('https://tiki.vn/api/v2/products&page=3&limit=100&category=1846')
    // console.log(response.data.data)
    return response.data.data
}

async function insertProduct(product) {
    const query = `
        INSERT INTO products (id, name, page_url, image_url, category, original_price, current_price, created_date, last_modified_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            page_url = EXCLUDED.page_url,
            image_url = EXCLUDED.image_url,
            category = EXCLUDED.category,
            original_price = EXCLUDED.original_price,
            current_price = EXCLUDED.current_price,
            last_modified_date = EXCLUDED.last_modified_date;
    `;
    const values= [product.id, product.name, `https://tiki.vn/${product.url_path}`,product.thumbnail_url, product.primary_category_name, product.original_price, product.price, new Date(), new Date()];
    await pool.query(query,values);
}


async function main(){
    const products = await getProductTiki();
    for (const product of products){
        await insertProduct(product)
    }
    console.log('Data inserted done')
    pool.end
}
main().catch((e)=> console.log(e));

