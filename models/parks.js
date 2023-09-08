const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const ParkSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref : 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref : 'Review'
        }
    ]
});

ParkSchema.post('findOneAndDelete', async function (doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in : doc.reviews
            }
        })

    }
})
module.exports = mongoose.model('Park', ParkSchema);