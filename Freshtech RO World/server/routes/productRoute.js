const Express = require('express');

const router = Express.Router();

const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoute');

// Mounting and merging reviewrouts with product route.
router.use('/:productId/reviews', reviewRouter);

router.route('/productStats').get(productController.getProductStats);

router
  .route('/monthlyStats/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    productController.getMonthlyStats,
  );

router
  .route('/top-5-cheapest')
  .get(productController.aliasTopFiveProducts, productController.getAllProducts);

router
  .route('/products-within/:distance/center/:latlng/unit/:unit')
  .get(productController.getProductsWithin);

router
  .route('/distances/:latlng/unit/:unit')
  .get(productController.getProductDistances);

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    productController.uploadUserPhoto,
    productController.resizeProductPhoto,
    productController.addProduct,
  );

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    productController.uploadUserPhoto,
    productController.resizeProductPhoto,
    productController.updateProduct,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    productController.deleteProduct,
  );

// * Rather using the reviewController here we can merge the routes using express functionalities.

// Post for products/:productId/reviews
// Get products products/:productId/reviews
// Get products review by id products/:productId/reviews/:reviewId

// router
//   .route('/:productId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.addReview,
//   );

module.exports = router;
