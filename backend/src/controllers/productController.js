import { validationResult } from 'express-validator';
import Product from '../models/Product.js';

// Helper function untuk extract error message
const getErrorMessage = (errors) => {
  let errorMessage = 'Validation failed';
  
  if (errors && errors.array && typeof errors.array === 'function') {
    const errorsArray = errors.array();
    if (errorsArray.length > 0) {
      errorMessage = errorsArray.map(e => e.msg).join(', ');
    }
  }
  
  return errorMessage;
};

/**
 * Get all products with pagination, filtering, and search
 * Query params: page, limit, category, search, sort, featured, bestseller
 */
export const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      sort = '-createdAt',
      featured,
      bestseller,
    } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (bestseller === 'true') filter.bestseller = true;

    // Search in name and description and brand
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const pageSize = Math.max(1, Math.min(100, parseInt(limit)));
    const skip = (pageNum - 1) * pageSize;

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    // Fetch products
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .lean();

    // Transform product data for frontend
    const transformedProducts = products.map(transformProduct);

    // Debug logging for rating values (development only)
    if (process.env.NODE_ENV === 'development' && transformedProducts.length > 0) {
      console.log(`[Products List] Sample ratings:`, transformedProducts.slice(0, 3).map(p => ({
        name: p.name,
        rating: p.rating,
        ratingType: typeof p.rating,
      })));
    }

    res.status(200).json({
      status: 'success',
      message: 'Products fetched successfully',
      products: {
        data: transformedProducts,
        meta: {
          total,
          current_page: pageNum,
          per_page: pageSize,
          last_page: Math.ceil(total / pageSize),
        },
      },
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Get single product by ID
 */
export const getProductDetail = async (req, res) => {
  try {
    const { id } = req.params;

    // Debug log
    console.log(`[getProductDetail] Called with ID: "${id}" (type: ${typeof id})`);

    // Validate ID format
    if (!id) {
      console.warn('[getProductDetail] Missing product ID');
      return res.status(400).json({
        status: 'error',
        message: 'Product ID is required',
        error: 'Missing product ID',
      });
    }

    // Find product
    console.log(`[getProductDetail] Searching for product in database with ID: ${id}`);
    const product = await Product.findById(id).lean();

    if (!product) {
      console.warn(`[getProductDetail] Product not found with ID: ${id}`);
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
        error: `Product with ID ${id} does not exist`,
      });
    }

    console.log(`[getProductDetail] Product found: ${product.name}`);

    // Transform product data
    const transformedProduct = transformProduct(product);

    // Debug logging for single product rating (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Product Detail] ID: ${transformedProduct.id}, Name: ${transformedProduct.name}, Rating: ${transformedProduct.rating}`);
    }

    res.status(200).json({
      status: 'success',
      message: 'Product fetched successfully',
      data: transformedProduct,
    });
  } catch (error) {
    console.error('[getProductDetail] Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Create new product (Admin only)
 */
export const createProduct = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: getErrorMessage(errors),
        errors: errors.array(),
      });
    }

    // Extract data from request body
    const {
      name,
      description,
      brand,
      category,
      price,
      thumbnail,
      gallery = [],
      key_features = [],
      product_overview = [],
      available_colors = [],
      rating,
      stock = 0,
      featured = false,
      bestseller = false,
      specifications = {},
      variants = [],
      options = {},
      reviews = [],
    } = req.body;

    // Create product
    const newProduct = new Product({
      name,
      description,
      brand,
      category,
      price,
      thumbnail,
      gallery,
      key_features,
      product_overview,
      available_colors,
      rating,
      stock,
      featured,
      bestseller,
      specifications,
      variants,
      options,
      reviews,
    });

    // Save to database
    await newProduct.save();

    // Transform and return
    const transformedProduct = transformProduct(newProduct.toObject());

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: transformedProduct,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Update product by ID (Admin only)
 */
export const updateProduct = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: getErrorMessage(errors),
        errors: errors.array(),
      });
    }

    const { id } = req.params;

    // Validate ID format
    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Product ID is required',
      });
    }

    // Build update object - only include provided fields
    const updateData = {};
    const allowedFields = [
      'name',
      'description',
      'brand',
      'category',
      'price',
      'thumbnail',
      'gallery',
      'key_features',
      'product_overview',
      'available_colors',
      'rating',
      'stock',
      'featured',
      'bestseller',
      'specifications',
      'variants',
      'options',
      'reviews',
    ];

    allowedFields.forEach(field => {
      if (req.body.hasOwnProperty(field)) {
        updateData[field] = req.body[field];
      }
    });

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProduct) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
        error: `Product with ID ${id} does not exist`,
      });
    }

    // Transform and return
    const transformedProduct = transformProduct(updatedProduct);

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: transformedProduct,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Delete product by ID (Admin only)
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Product ID is required',
      });
    }

    // Delete product
    const deletedProduct = await Product.findByIdAndDelete(id).lean();

    if (!deletedProduct) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
        error: `Product with ID ${id} does not exist`,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
      data: null,
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;

    if (!category) {
      return res.status(400).json({
        status: 'error',
        message: 'Category is required',
      });
    }

    const pageNum = Math.max(1, parseInt(page));
    const pageSize = Math.max(1, Math.min(100, parseInt(limit)));
    const skip = (pageNum - 1) * pageSize;

    const total = await Product.countDocuments({ category });
    const products = await Product.find({ category })
      .sort('-createdAt')
      .skip(skip)
      .limit(pageSize)
      .lean();

    const transformedProducts = products.map(transformProduct);

    res.status(200).json({
      status: 'success',
      message: 'Products by category fetched successfully',
      products: {
        data: transformedProducts,
        meta: {
          total,
          current_page: pageNum,
          per_page: pageSize,
          last_page: Math.ceil(total / pageSize),
        },
      },
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products by category',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Transform product data from MongoDB model to API response format
 * Maps backend field names to frontend expected names
 */
function transformProduct(product) {
  if (!product) return null;

  // Determine availability from stock
  const stock = product.stock || 0;
  const availability = {
    status: stock > 0 ? 'in_stock' : 'out_of_stock',
    label: stock > 0 ? 'Tersedia' : 'Stok Habis',
    color: stock > 0 ? 'green' : 'red',
  };

  // Ensure rating is a precise decimal number, not rounded or string
  let ratingValue = product.rating;
  if (ratingValue === undefined || ratingValue === null) {
    ratingValue = 4.0;
  }
  // Convert to number if it's a string, ensure decimal precision
  ratingValue = Number(ratingValue);
  if (isNaN(ratingValue)) {
    ratingValue = 4.0;
  }
  // Clamp to valid range (0-5)
  ratingValue = Math.max(0, Math.min(5, ratingValue));

  return {
    id: product._id,
    name: product.name || '',
    description: product.description || '',
    brand: product.brand || '',
    category: product.category || '',
    price: product.price || 0,
    rating: ratingValue,
    thumbnail: product.thumbnail || '',
    images: product.gallery || [],
    features: product.key_features || [],
    overview: product.product_overview || [],
    colors: product.available_colors || [],
    isFeatured: product.featured || false,
    isBestseller: product.bestseller || false,
    stock: stock,
    specs: product.specifications || {},
    variants: product.variants && product.variants.length > 0 ? product.variants : undefined,
    options: product.options || {},
    reviews: product.reviews || [],
    availability: availability,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}
