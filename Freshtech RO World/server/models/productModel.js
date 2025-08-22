const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name.'],
      unique: true,
      trim: true,
      // maxLength and minLength could be only used with String type.
      minLength: [10, 'A product name must have more than 10 characters.'],
      maxLength: [40, 'A product name must have less than 40 characters.'],
    },
    slug: String,
    secretProduct: Boolean,
    ratingsAverage: {
      type: Number,
      default: 4.5,
      // min and max could be only used with numbers and date.
      min: [1, 'A product must have rating greater than 1.'],
      max: [5, 'A product must have rating less than 5.'],
      set: val => Math.round(val*10) / 10, // 4.66666 -> 5, 4.66666 * 10 = 46.66666 -> 47 & 47/10 = 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    color: {
        type: String,
    },
    stage: {
      type: Number,
      required: [true, 'A product must have stages'],
    },
    storage: {
        type: Number,
    },
    features: [String],
    power: {
        type: Number,
    },
    installation: {
      type: String,
      enum: ['Free', 'Paid'],
      default: 'Free'
    },
    guarantee: {
        type: Number,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'A product must have a price.'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this will only run on create new documents, not on update because we are using 'this'
          // 'this' only points to current document, while creating new one.
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be less than regular price.',
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A product must have cover image'],
    },
    images: [String],
    // New fields to match client expectations
    category: {
      type: String,
      required: [true, 'A product must have a category.'],
      enum: ['RO Systems', 'Water Filters', 'Accessories', 'Spare Parts'],
      default: 'RO Systems'
    },
    inStock: {
      type: Boolean,
      default: true
    },
    specifications: {
      type: Map,
      of: String,
      default: {}
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// indexes helps to control the number of documents examined while querying with any filter or searching.
// productSchema.index({price: 1});
productSchema.index({price: 1, ratingsAverage: -1});
productSchema.index({slug: 1});

// Creating virtual field for populating.
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
})

// These are docuemnt middleware and this middleware only runs on create or save, not on insertMany, update, find.
productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.updatedAt = Date.now();
  next();
});

// Update updatedAt field on findOneAndUpdate operations
productSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// // Embed user documents in the guides for products.
// productSchema.pre('save', async function(next) {
//   // Need to await for the user, also the map will return all the promises and we will need to resolve them to get the results.
//   const guidesPromise = this.guides.map(async id => await User.findById(id));

//   // Resolving all promises.
//   this.guides = await Promise.all(guidesPromise);
//   next();
// });

productSchema.pre(/^find/, function (next) {
  // here we user the regular expression to match all the methods strted with find.
  // productSchema.pre('find', function (next) { // it will not run for findById, find one and other find methods.
  this.start = Date.now();
  this.find({ secretProduct: { $ne: true } });
  next();
});

productSchema.post(/^find/, function (docs, next) {
  console.log(`Qyery took ${Date.now() - this.start} miliseconds...!`);
  next();
});

// // aggregation pipeline middleware
// productSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretProduct: { $ne: true } } }); // shift and unshift are js function for array, shift-add at the end .. unshift-add at begining.
//   console.log(this.pipeline());
//   next();
// });

// we can have the multipe middlewares configured here.
// productSchema.pre('save', function (next) {
//   console.log('pre save 2 middleware.');
//   next();
// });

// productSchema.post('save', function (next) {
//   console.log('post save middleware.');
//   next();
// });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
