import { body } from 'express-validator';

export const validateRegister = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Nama lengkap tidak boleh kosong')
    .isLength({ min: 3 })
    .withMessage('Nama lengkap minimal 3 karakter'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email tidak valid'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password minimal 6 karakter'),
  body('phone')
    .optional()
    .trim(),
];

export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email tidak valid'),
  body('password')
    .notEmpty()
    .withMessage('Password tidak boleh kosong'),
];

export const validateUpdateProfile = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Nama lengkap minimal 3 karakter'),
  body('phone')
    .optional()
    .trim(),
  body('address')
    .optional()
    .trim(),
  body('city')
    .optional()
    .trim(),
  body('province')
    .optional()
    .trim(),
  body('postalCode')
    .optional()
    .trim(),
];

// Product Validation
export const validateCreateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nama produk tidak boleh kosong')
    .isLength({ min: 3, max: 200 })
    .withMessage('Nama produk harus antara 3-200 karakter'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Deskripsi produk tidak boleh kosong')
    .isLength({ min: 10 })
    .withMessage('Deskripsi produk minimal 10 karakter'),
  
  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand tidak boleh kosong'),
  
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Kategori tidak boleh kosong')
    .isIn(['Monitor', 'Keyboard', 'Mouse', 'Headset', 'Mousepad'])
    .withMessage('Kategori tidak valid'),
  
  body('price')
    .notEmpty()
    .withMessage('Harga tidak boleh kosong')
    .isFloat({ min: 0 })
    .withMessage('Harga harus berupa angka positif'),
  
  body('thumbnail')
    .trim()
    .notEmpty()
    .withMessage('Thumbnail tidak boleh kosong'),
  
  body('gallery')
    .optional()
    .isArray()
    .withMessage('Gallery harus berupa array'),
  
  body('key_features')
    .optional()
    .isArray()
    .withMessage('Key features harus berupa array'),
  
  body('product_overview')
    .optional()
    .isArray()
    .withMessage('Product overview harus berupa array'),
  
  body('available_colors')
    .optional()
    .isArray()
    .withMessage('Available colors harus berupa array'),
  
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating harus antara 0-5'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock harus berupa angka non-negatif'),
  
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured harus berupa boolean'),
  
  body('bestseller')
    .optional()
    .isBoolean()
    .withMessage('Bestseller harus berupa boolean'),
];

export const validateUpdateProduct = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Nama produk harus antara 3-200 karakter'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Deskripsi produk minimal 10 karakter'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Harga harus berupa angka positif'),
  
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating harus antara 0-5'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock harus berupa angka non-negatif'),
];
