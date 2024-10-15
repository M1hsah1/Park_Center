const Park = require('../models/parks');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const { cloudinary } = require("../cloudinary");
module.exports.index = async (req,res)=> {
    const parks = await Park.find({});
    res.render('parks/index', {parks});
}

module.exports.renderNewPark = (req,res)=>{
    res.render("parks/new")
}

module.exports.newPark = async(req,res,next)=>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.park.location,
        limit:1
    }).send()
    const park = new Park(req.body.park);
    park.geometry = geoData.body.features[0].geometry;
    park.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    park.author = req.user._id;
    console.log(park)
    await park.save();
    req.flash('success', 'Made a new listing!')
    res.redirect(`parks/${park._id}`)

}

module.exports.showRoute = async (req,res)=> {
    const park = await Park.findById(req.params.id).populate({path: 'reviews', populate: {path: 'author'}}).populate('author');
    if(!park){
        req.flash('error', 'Listing does not exist');
        return res.redirect('/parks')
    }
    res.render('parks/show', {park});
} 

module.exports.editRoute = async(req,res)=>{
    const park = await Park.findById(req.params.id);
    if(!park){
        req.flash('error', 'Listing does not exist');
        return res.redirect('/parks')
    }
    res.render('parks/edit',{park});

}

module.exports.editPUT = async(req,res)=>{
    const { id } = req.params;
    const newPark = await Park.findByIdAndUpdate(id, {...req.body.park});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    newPark.images.push(...imgs);
    await newPark.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await newPark.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Successfully updated the listing!');
    res.redirect(`/parks/${newPark._id}`);

}

module.exports.destroy = async(req,res)=>{
    const { id } = req.params;
    await Park.findByIdAndDelete(id);
    req.flash('success', 'Deleted the listing!')
    res.redirect('/parks');
}