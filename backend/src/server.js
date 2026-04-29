import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { seedProducts } from './data/seedProducts.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware - log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);

// Debug routes - untuk testing endpoint availability
app.get('/api/debug/routes', (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend is running',
    availableEndpoints: {
      products: {
        list: 'GET /api/catalog',
        detail_primary: 'GET /api/catalog/product/:id (Primary)',
        detail_backup: 'GET /api/products/:id (Backup)',
        byCategory: 'GET /api/catalog/category/:category',
      },
      admin: {
        create: 'POST /api/catalog',
        update: 'PUT /api/catalog/:id',
        delete: 'DELETE /api/catalog/:id',
      },
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
      },
    },
    note: 'If /api/catalog/product/:id returns 404, the backup endpoint /api/products/:id will be used automatically',
  });
});

// Test product detail endpoint
app.get('/api/debug/catalog/product/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    status: 'debug',
    message: 'This is a debug endpoint to verify routing',
    receivedId: id,
    testInfo: 'If you can see this, routing to /catalog/product/:id should work',
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Alternative product detail route (backup if router pattern doesn't match)
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[Backup Route] GET /api/products/:id called with ID: ${id}`);
    
    // Import Product model
    const Product = (await import('../models/Product.js')).default;
    const product = await Product.findById(id).lean();
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
        error: `Product with ID ${id} does not exist`,
      });
    }
    
    // Transform product
    const transformedProduct = {
      id: product._id,
      name: product.name || '',
      description: product.description || '',
      brand: product.brand || '',
      category: product.category || '',
      price: product.price || 0,
      rating: product.rating || 4.0,
      thumbnail: product.thumbnail || '',
      images: product.gallery || [],
      features: product.key_features || [],
      overview: product.product_overview || [],
      colors: product.available_colors || [],
      isFeatured: product.featured || false,
      isBestseller: product.bestseller || false,
      specs: product.specifications || {},
      reviews: product.reviews || [],
      availability: {
        status: (product.stock || 0) > 0 ? 'in_stock' : 'out_of_stock',
        label: (product.stock || 0) > 0 ? 'Tersedia' : 'Stok Habis',
        color: (product.stock || 0) > 0 ? 'green' : 'red',
      },
    };
    
    res.status(200).json({
      status: 'success',
      message: 'Product fetched successfully',
      data: transformedProduct,
    });
  } catch (error) {
    console.error('[Backup Route] Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Not Found handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route tidak ditemukan',
  });
});

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    
    // Seed products on startup (if not already seeded)
    if (process.env.NODE_ENV === 'development') {
      await seedProducts();
    }
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
