const catchAsync = require('../utils/catchAsync');
const Product = require('../models/productModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  const products = await Product.find();
  console.log(products);

  res.status(200).render('overview', {
    title: 'Overview',
    products: products,
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
    const productSlug = req.params.productSlug;
    const Product = await Product.findOne({slug: productSlug}).populate({
        path: 'reviews',
        select: 'review rating user -Product',
    });

    res.status(200).render('Product', {
        title: Product.name,
        product: tour,
    })
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log in to your account.',
    nonce: res.locals.nonce
  });
}

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Account info',
    user: res.locals.user
  })
}
