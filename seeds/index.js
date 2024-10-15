const mongoose = require('mongoose');
const Park = require('../models/parks');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
mongoose.connect('mongodb://127.0.0.1:27017/park-db')


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () =>{
    console.log("Database connected");
});

const seedDB = async() =>{
    await Park.deleteMany({});
    for(let i = 0; i < 200; i++){
        
        const randL = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const park = new Park({
            author: '64f5b62d4a6d602bf627b2ec',
            title: ` ${descriptors[Math.floor(Math.random() * descriptors.length)]} ${places[Math.floor(Math.random() * places.length)]}`,
            location: `${cities[randL].city}, ${cities[randL].state}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/dqlxueuwt/image/upload/v1726699215/ParkCenter/l6tiaqim7jz1lq8dgtew.png',
                  filename: 'ParkCenter/l6tiaqim7jz1lq8dgtew',
                },
                {
                  url: 'https://res.cloudinary.com/dqlxueuwt/image/upload/v1726699214/ParkCenter/ehshiijclsyfcgl9rzcu.webp',
                  filename: 'ParkCenter/ehshiijclsyfcgl9rzcu',
                }
              ],            
            description : 'Ive rented a car in Las Vegas and have reserved a hotel in Twentynine Palms which is just north of Joshua Tree. Well drive from Las Vegas through Mojave National Preserve and possibly do a short hike on our way down. Then spend all day on Monday at Joshua Tree. We can decide the next morning if we want to do more in Joshua Tree or Mojave before we head back',
            price : price,
            geometry:{
              type: "Point",
              coordinates:[cities[randL].longitude,cities[randL].latitude]
            }
            
        })
        await park.save();
    }
}
seedDB().then(() =>{
    mongoose.connection.close()
});