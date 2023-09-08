const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { parkSchema } = require('../schemas.js')
const {LoggedIn} = require('../middleware')
const ExpressError = require('../utils/ExpressError');
const Park = require('../models/parks');
const parkController = require('../controllers/parkController');

const validatePark = (req,res,next) => {
    const { error } = parkSchema.validate(req.body);
    if (error){
        const msg = error.details.map(x => x.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }
}

const isAuthor = async(req,res,next) =>{
    const {id} = req.params;
    const findPark = await Park.findById(id);
    if(!findPark.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission')
        return res.redirect(`/parks/${id}`);
    }
    next();
}

router.get('/', catchAsync(parkController.index));

router.get('/new',LoggedIn,parkController.renderNewPark);

router.post('/', LoggedIn,validatePark, catchAsync(parkController.newPark))

router.get('/:id', catchAsync(parkController.showRoute))

router.get('/:id/edit', LoggedIn, isAuthor, catchAsync(parkController.editRoute))

router.put('/:id', LoggedIn, isAuthor, validatePark, catchAsync(parkController.editPUT))
router.delete('/:id', LoggedIn, isAuthor, catchAsync(parkController.destroy))

module.exports = router;