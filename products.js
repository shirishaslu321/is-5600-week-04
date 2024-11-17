const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

async function list (options = {}) {

    const { offset = 0, limit = 25, tag } = options;

    const data = await fs.readFile(productsFile)

    return JSON.parse(data)
    .filter(product => {
        if (!tag) {
            return product
        }

        return product.tags.find(( { title } ) => title == tag)
    })
    .slice(offset, offset + limit)
}

async function get (id) {
    const products = JSON.parse(await fs.readFile(productsFile))

    for (let i = 0; i < products.length; i++ ) {
        if(products[i].id === id) {
            return products[i]
        }
    }
    
    return null;
}
/**
 * Delete a product by ID
 * @param {string} id
 * @returns {boolean}
 */

async function deleteProduct(id) {
    if (products.has(id)) {
        products.delete(id);
        return true;
    } else {
        throw new Error(`Product with ID ${id} not found`);
    }
}
// Pull (Update) a product
async function pull(id, updatedProduct) {
    if (!products.has(id)) {
        throw new Error(`Product with ID ${id} not found`); // Product must exist to update
    }
    const existingProduct = products.get(id);
    const updated = { ...existingProduct, ...updatedProduct }; // Merge old product with new data
    products.set(id, updated); // Save the updated product
    return updated; // Return the updated product
}

module.exports = {
    list,
    get,
    delete: deleteProduct,
    pull,
  }