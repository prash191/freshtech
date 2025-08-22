const Product = require('../models/productModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get dashboard statistics
exports.getDashboardStats = catchAsync(async (req, res, next) => {
  // Get total products
  const totalProducts = await Product.countDocuments();
  
  // Get total users (excluding admins)
  const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
  
  // Get total reviews
  const totalReviews = await Review.countDocuments();
  
  // Calculate total revenue (placeholder - would need order model)
  const totalRevenue = 0; // TODO: Implement when order model is available
  
  // Get products with low stock (less than 5 in stock)
  const lowStockProducts = await Product.countDocuments({ 
    // Add stock field when available
    // stock: { $lt: 5 }
  });

  res.status(200).json({
    status: 'success',
    data: {
      totalProducts,
      totalUsers,
      totalOrders: 0, // TODO: Implement when order model is available
      totalRevenue,
      totalReviews,
      lowStockProducts,
    },
  });
});

// Get recent activities
exports.getRecentActivities = catchAsync(async (req, res, next) => {
  const activities = [];
  
  // Get recent products (last 5)
  const recentProducts = await Product.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name createdAt');
  
  recentProducts.forEach(product => {
    activities.push({
      id: product._id.toString(),
      text: `New product "${product.name}" added`,
      time: product.createdAt,
      type: 'product',
    });
  });
  
  // Get recent users (last 5)
  const recentUsers = await User.find({ role: { $ne: 'admin' } })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name createdAt');
  
  recentUsers.forEach(user => {
    activities.push({
      id: user._id.toString(),
      text: `New user "${user.name}" registered`,
      time: user.createdAt,
      type: 'user',
    });
  });
  
  // Get recent reviews (last 5)
  const recentReviews = await Review.find()
    .populate('user', 'name')
    .populate('product', 'name')
    .sort({ createdAt: -1 })
    .limit(5)
    .select('rating createdAt');
  
  recentReviews.forEach(review => {
    activities.push({
      id: review._id.toString(),
      text: `New ${review.rating}-star review for "${review.product?.name || 'Product'}"`,
      time: review.createdAt,
      type: 'review',
    });
  });
  
  // Sort all activities by time (most recent first) and take top 10
  const sortedActivities = activities
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 10)
    .map(activity => ({
      ...activity,
      time: formatTimeAgo(activity.time),
    }));

  res.status(200).json({
    status: 'success',
    data: sortedActivities,
  });
});

// Helper function to format time ago
function formatTimeAgo(date) {
  const now = new Date();
  const timeDiff = now - new Date(date);
  const minutes = Math.floor(timeDiff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}
