import { getProductsFromDB, getProductByIdFromDB, postProductsInDB, updateProductInDB, deleteProductFromDB } from "./productsModel.js";

async function getProducts(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const category = req.query.category;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const products = await getProductsFromDB(category);

  const paginatedProducts = products.slice(startIndex, endIndex);

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
}

async function getProductById(req, res) {
  const productId = parseInt(req.params.id);
  const product = await getProductByIdFromDB(productId);
  res.json(product);
}

async function postProducts(req, res) {
  const productData = req.body;
  const newProduct = await postProductsInDB(productData);
  console.log(`Posted product: ${JSON.stringify(newProduct)}`);
  res.json(newProduct);
}

async function updateProduct(req, res) {
  const productId = parseInt(req.params.id);
  const productData = req.body;
  const updatedProduct = await updateProductInDB(productId, productData);
  res.json(updatedProduct);
}

async function deleteProduct(req, res) {
  const productId = parseInt(req.params.id);
  await deleteProductFromDB(productId);
  res.json({ msg: `Product with id ${productId} deleted` });
}

export default { getProducts, getProductById, postProducts, deleteProduct, updateProduct };
