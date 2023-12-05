import { getProductsFromDB, getProductByIdFromDB, postProductsInDB, updateProductInDB, deleteProductFromDB, searchProductsFromDB } from "./productsModel.js";

async function getProducts(req, res) {
  try {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const category = req.query.category;
  const sort = req.query.sort;
  const label = req.query.label;
 

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const products = await getProductsFromDB(category, sort, label);

  const paginatedProducts = products.slice(startIndex, endIndex);

  // HAR VALGT AT BRUGE MATH.CEIL SÅ VI SIKRER OS AT FÅ ALT DATA MED.
  const totalPages = Math.ceil(products.length / limit);

  const paginationInfo = {
    data: paginatedProducts,
    meta: {
    pagination: {
      current_page: page,
      last_page: totalPages,
      per_page: limit,
      total: products.length,
  }
  }
  }

  res.json(paginationInfo);
} catch (error) {
  console.log(error);
  res.status(500).json({ message: "Failed to get products" });
}
}

async function getProductById(req, res) {
  try {
  const productId = parseInt(req.params.id);
  const product = await getProductByIdFromDB(productId);
  res.json(product);
} catch (error) {
  console.log(error);
  res.status(500).json({ message: "Failed to get product by ID" });
}
}

async function postProducts(req, res) {
  try {
  const productData = req.body;
  // Validate input
  if (!productData.product_name){
    return res.status(400).json({ message: "Product name is required" });
  }
  if (!productData.underline){
    return res.status(400).json({ message: "Product underline is required" });
  }
  if (!productData.description){
    return res.status(400).json({ message: "Product description is required" });
  }
  if (!productData.image_url){
    return res.status(400).json({ message: "Product image is required" });
  }
  if (!productData.inventory){
    return res.status(400).json({ message: "Product inventory is required" });
  }
  if (!productData.price){
    return res.status(400).json({ message: "Product price is required" });
  }
  if (!productData.starting_at){
    return res.status(400).json({ message: "Starting date for price is required " });
  }
  if (!productData.is_campaign){
    return res.status(400).json({ message: "Campaign is required" });
  }
  if (!productData.ending_at){
    return res.status(400).json({ message: "Ending date for price is required" });
  }
  const newProduct = await postProductsInDB(productData);
  console.log(`Posted product: ${JSON.stringify(newProduct)}`);
  res.json(newProduct);
} catch (error) {
  console.log(error);
  res.status(500).json({ message: "Failed to post product" });
}
}

async function updateProduct(req, res) {
  try {
  const productId = parseInt(req.params.id);
  const productData = req.body;
  const updatedProduct = await updateProductInDB(productId, productData);
  console.log(`Updated product with ${updatedProduct}`);
  res.json({ msg: `Product with id ${productId} updated`});
} catch (error) {
  console.log(error);
  res.status(500).json({ message: "Failed to update product" });
}
}

async function deleteProduct(req, res) {
  try {
  const productId = parseInt(req.params.id);
  await deleteProductFromDB(productId);
  res.json({ msg: `Product with id ${productId} deleted` });
} catch (error) {
  console.log(error);
  res.status(500).json({ message: "Failed to delete product" });
}
}

async function searchProducts(req, res) {
  try {
  const search = req.query.search;
  const category = req.query.category;
  const sort = req.query.sort;
  const label = req.query.label;
  const results = await searchProductsFromDB(search, category, sort, label);
  // DENNE KAN UDELADES - DETTE ER BARE SÅ VI FÅR SAMME STRUKTUR SOM VED GET REQUEST MEN UDEN META ARRAY
  const products = {
    data: results,
  }
  res.json(products);
} catch (error) {
  console.log(error);
  res.status(500).json({ message: "Failed to get products" });
}
}

export default { getProducts, getProductById, postProducts, deleteProduct, updateProduct, searchProducts };
