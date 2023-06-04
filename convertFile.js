const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Read the input CSV file
fs.createReadStream('./order_items.csv')
  .pipe(csv())
  .on('data', (row) => {
    // Extract the order_id from the row
    const order_id = row.order_id;

    // Loop through the products and quantities
    for (let i = 1; i <= 3; i++) {
      // Extract the product_id and quantity from the row
      const product_id = row[`product_${i}`];
      const quantity = row[`quantity_${i}`];

      // Create a new row for the product_id and quantity
      const new_row = {
        id: i,
        order_id: order_id,
        product_id: product_id,
        quantity: quantity,
      };

      // Append the new row to the output CSV file
      const csvWriter = createCsvWriter({
        path: './output.csv',
        header: [
          {id: 'id', title: 'id'},
          {id: 'order_id', title: 'order_id'},
          {id: 'product_id', title: 'product_id'},
          {id: 'quantity', title: 'quantity'},
        ],
        append: true,
      });
      csvWriter.writeRecords([new_row]);
    }
  })
  .on('end', () => {
    console.log('CSV file successfully processed.');
  });
