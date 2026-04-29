import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [200, 'Product name cannot be more than 200 characters'],
      minlength: [3, 'Product name must be at least 3 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
      minlength: [10, 'Description must be at least 10 characters'],
    },
    brand: {
      type: String,
      required: [true, 'Please provide a brand name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a product category'],
      enum: ['Monitor', 'Keyboard', 'Mouse', 'Headset', 'Mousepad'],
    },

    // Pricing
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      min: [0, 'Price cannot be negative'],
    },

    // Ratings & Reviews
    rating: {
      type: Number,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be greater than 5'],
      default: 4.0,
      // Note: Stored as decimal (e.g., 4.8, 4.5, 3.7)
      // Frontend uses half-star rendering based on decimal value
    },

    // Images
    thumbnail: {
      type: String,
      required: [true, 'Please provide a thumbnail image'],
    },
    gallery: [
      {
        type: String,
        required: true,
      },
    ],

    // Product Details
    key_features: [
      {
        type: String,
        required: true,
      },
    ],
    product_overview: [
      {
        type: String,
        required: true,
      },
    ],
    available_colors: [
      {
        type: String,
        required: true,
      },
    ],

    // Badges
    featured: {
      type: Boolean,
      default: false,
    },
    bestseller: {
      type: Boolean,
      default: false,
    },

    // Additional Fields
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    specifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    variants: [
      {
        name: String,
        price: Number,
        stock: Number,
      },
    ],
    options: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    reviews: [
      {
        name: String,
        rating: { type: Number, min: 0, max: 5 },
        date: String,
        comment: String,
      },
    ],
    availability: {
      status: {
        type: String,
        enum: ['in_stock', 'out_of_stock', 'pre_order'],
        default: 'in_stock',
      },
      label: {
        type: String,
        default: 'Available',
      },
      color: {
        type: String,
        default: 'green',
      },
    },

    // Metadata
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: false,
    },
  },
  { timestamps: true }
);

// Index for search and filtering
productSchema.index({ name: 'text', description: 'text', brand: 1, category: 1 });
productSchema.index({ featured: 1, bestseller: 1 });

// Pre-save hook to auto-set availability status based on stock
productSchema.pre('save', function (next) {
  if (!this.availability) {
    this.availability = {
      status: 'in_stock',
      label: 'Available',
      color: 'green',
    };
  }

  if (this.stock <= 0) {
    this.availability.status = 'out_of_stock';
    this.availability.label = 'Out of Stock';
    this.availability.color = 'red';
  } else if (this.stock > 0) {
    this.availability.status = 'in_stock';
    this.availability.label = 'Available';
    this.availability.color = 'green';
  }

  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
