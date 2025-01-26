const Express = require('express');

const router = Express.Router({ mergeParams: true });

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

router
  .route('/')
  .get(reviewController.getAllReview)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.addTourAndUserIds,
    reviewController.addReview,
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.updateReview,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    reviewController.deleteReview,
  );

module.exports = router;
