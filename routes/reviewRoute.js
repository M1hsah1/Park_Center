const express = require('express');
const router = express.Router({mergeParams : true});
const catchAsync = require('../utils/catchAsync');
const { reviewSchema } = require('../schemas.js')
const ExpressError = require('../utils/ExpressError');
const {LoggedIn} = require('../middleware');
const Park = require('../models/parks');
const Review = require('../models/review');
const reviewController = require('../controllers/reviewController');

const isAuthor = async(req,res,next) =>{
    const {id, reviewId} = req.params;
    const findPark = await Review.findById(reviewId);
    if(!findPark.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission')
        return res.redirect(`/parks/${id}`);
    }
    next();
}

const validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    if (error){
        const msg = error.details.map(x => x.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }

}

router.post('/', LoggedIn, validateReview, catchAsync(reviewController.createReview))

router.delete('/:reviewId', LoggedIn, isAuthor,catchAsync(reviewController.deleteReview))

module.exports = router;