const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  }
  
  /**
   * List all products
   * @param {object} req
   * @param {object} res
   */
  async function listProducts(req, res) {
    const { offset = 0, limit = 25, tag } = req.query;

    try {
      res.json(await Products.list({
        offset: Number(offset),
        limit: Number(limit),
        tag,
      }))
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }


  async function getProduct (req, res, next) {
    const { id } = req.params;

    try{
      const product = await Products.get(id)
      if (!product) {
        return next()
      }

      return res.json(product)

    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  
  }

  async function createProduct (req, res) {
    console.log('request body', req.body)
    res.json(req.body)
  }
  /** 
  * Delete a product
  * @param {object} req
  * @param {object} res
  */
   
  async function deleteProduct(req, res) {
    const { id } = req.params;
    await Products.delete(id); // Call delete method
    console.log(`Product with ID ${id} deleted`);
    res.status(202).json({ message: `Product with ID ${id} deleted` });
  }
  // Pull (Update) a product
async function pullProduct(req, res) {
  const { id } = req.params;
  const updatedProductData = req.body; // Get updated product data from request body

  try {
      const updatedProduct = await Products.pull(id, updatedProductData); // Call pull from products.js
      res.status(200).json(updatedProduct); // Respond with updated product
  } catch (error) {
      res.status(404).json({ error: error.message }); // Handle errors (e.g., product not found)
  }
}

  
  module.exports = autoCatch ({
    handleRoot,
    listProducts,
    getProduct,
    createProduct,
    deleteProduct,
    pullProduct,
  });