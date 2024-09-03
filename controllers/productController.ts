import { Request, Response } from 'express';
import { Product, ProductsData} from '../dataStructure/product';
import path from 'path';
import { readProducts } from '../helpers/readProducts';
import { generateId} from '../helpers/generateId';
import { writeProducts} from '../helpers/writeProducts';

const filePath = path.resolve(__dirname, '../products.json');

// GET /products (with optional category filter)
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await readProducts(filePath);
    
    // get category query parameter if it exists
    const categoryFilter = req.query.category as string | undefined;

    // Filter products by category if categoryFilter is provided
    if (categoryFilter) {
      const filteredProducts = data.products.filter(product => product.category === categoryFilter);
      
      if (filteredProducts.length === 0) {
        res.status(404).send("No products found for the given category");
        return;
      } else {
        res.json(filteredProducts);
        return;
      }
    }

    //If no categoryFilter is provided, return all products
    res.json(data.products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send("Server error");
  }
};



// GET /products/:id
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await readProducts(filePath);
    const reqId = String(req.params.id);
    const product = data.products.find((el: Product) => el.id === reqId && !el.deleted);
    
    if (!product) {
      res.status(404).send("Product not found");
      return;
    } else {
      res.send(product);
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Server error");
  }
};


// POST /products
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  
  const { name, description, price, category, stock, tags, rating } = req.body;
 
  // // Check if required fields are present
  if (!name || !description || typeof price !== 'number' || !category || !stock || !tags || typeof rating !== 'number') {
    res.status(400).send('Missing required product data' );
    return;
  }

  // Check if stock structure is valid
  if (!stock.available || !stock.reserved || !stock.location) {
    res.status(400).send('Invalid stock data' );
    return;
  }

  // Check if price and stock values are valid
  if (price <= 0 || stock.available < 0 || stock.reserved < 0) {
    res.status(400).send( 'Invalid product data' );
    return;
  }

  try {
    const data = await readProducts(filePath);
    const newProduct: Product = {
      id: generateId(data),
      name,
      description,
      price,
      category,
      stock,
      tags,
      rating,
      deleted: false,
    };
    console.log("new product", newProduct)

    data.products.push(newProduct);
    await writeProducts(data,filePath);
    res.status(201).json(newProduct);
    console.log("Created successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
};


// PUT /products/:id
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const data = await readProducts(filePath);
    const productIndex = data.products.findIndex(p => p.id === req.params.id && !p.deleted);
    console.log("Product index",productIndex)
    console.log("request body",req.body)
    if (productIndex === -1) {
      return res.status(404).send('Product not found' );
    }

    data.products[productIndex] = { ...data.products[productIndex], ...req.body };
    await writeProducts(data,filePath);
    res.json(data.products[productIndex]);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

// PATCH /products/:id/manufacturer/address
export const partialUpdateProduct = async (req: Request, res: Response) => {
  try {
    const data = await readProducts(filePath);
    const product = data.products.find(p => p.id === req.params.id && !p.deleted);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // check if manufacturer objects exist
    if (!product.manufacturer) {
      product.manufacturer = {};
    }
    // check if manufacturer address objects exists
    if (!product.manufacturer.address) {
      product.manufacturer.address = {};
    }

    // Update fields from request body
    if (req.body.manufacturer && req.body.manufacturer.address) {
      const addressUpdate = req.body.manufacturer.address;
      product.manufacturer.address = {
        ...product.manufacturer.address,
        ...addressUpdate
      };
    }

    await writeProducts(data,filePath);
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).send("Server error");
  }
};


// DELETE /products/:id
export const deleteProduct = async (req: Request, res: Response) :Promise<void> => {
  try {
    const data: ProductsData  = await readProducts(filePath);
    const reqId = String(req.params.id);
    
    const productIndex = data.products.findIndex((product) => product.id === reqId && !product.deleted);
 
    if (productIndex === -1) {
       res.status(404).send("Product not found");
       return
    }

    data.products[productIndex].deleted = true;
    await writeProducts(data,filePath);
    res.status(200).send("Deleted successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
};









