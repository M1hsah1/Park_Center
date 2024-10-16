const Joi = require('joi');
const {number } = require('joi');

module.exports.parkSchema = Joi.object({
    park: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages: Joi.array(),
});
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body:Joi.string().required()
    }).required()
})