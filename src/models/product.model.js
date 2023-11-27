const { model, Schema } = require('mongoose'); // Erase if already required
const slugify = require('slugify');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';
// Declare the Schema of the Mongo model
var productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
    },
    product_slug: {
      type: String,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ['Electronics', 'Furniture', 'Grocery', 'Clothing', 'Others'],
    },
    product_user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    /// more
    product_ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above or equal 1.0'],
      max: [5, 'Rating must be below or equal 5.0'],
      // 3.412312
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: {
      type: Array,
      default: [],
    },
    isDaft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// index text
productSchema.index({ product_name: 'text', product_description: 'text' });

// document middlewares
productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, {
    lower: true,
  });
  next();
});

var electronicSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    product_user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    collection: 'Electronics',
  }
);

var furnitureSchema = new Schema(
  {
    color: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    product_user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    collection: 'Furniture',
  }
);

var clothingSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
    product_user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    collection: 'Clothes',
  }
);
//Export the model
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  electronic: model('Electronic', electronicSchema),
  furniture: model('Furniture', furnitureSchema),
  clothing: model('Clothing', clothingSchema),
};
