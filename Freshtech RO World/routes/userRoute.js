const Express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = Express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

// This is the middleware and will run before any route after this code.
router.use(authController.protect);

router.route('/updatePassword').patch(authController.updatePassword);
router
  .route('/updateMe')
  .patch(
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe,
  );
router.route('/deleteMe').delete(userController.deleteMe);
router.route('/me').get(userController.setUserId, userController.getUser);

router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUser).post(userController.addUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(authController.restrictTo('admin'), userController.updateUser)
  .delete(authController.restrictTo('admin'), userController.deleteUser);

module.exports = router;
