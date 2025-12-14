const express=require('express');
const router=express.Router({mergeParams:true});
const Listing=require('../models/listing');
const Review=require('../models/review');
const wrapAsync=require('../utils/wrapAsync');
const ExpressError=require('../utils/ExpressError');
const { reviewSchema } = require('../schema.js');

const { isLoggedIn, validateReview, isOwner, isReviewAuthor } = require('../middleware.js');
const reviewController=require("../controllers/review.js");

//validation middleware for reviews

//Reviews
//post review route
router.post('/',
  isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
//delete Review Route
router.delete('/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview));
module.exports=router;
