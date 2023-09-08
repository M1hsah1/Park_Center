const Park = require('../models/parks');

module.exports.index = async (req,res)=> {
    const parks = await Park.find({});
    res.render('parks/index', {parks});
}

module.exports.renderNewPark = (req,res)=>{
    res.render("parks/new")
}

module.exports.newPark = async(req,res,next)=>{
    const park = new Park(req.body.park);
    park.author = req.user._id;
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
    req.flash('success', 'Successfully updated the listing!')
    res.redirect(`/parks/${newPark._id}`);

}

module.exports.destroy = async(req,res)=>{
    const { id } = req.params;
    await Park.findByIdAndDelete(id);
    req.flash('success', 'Deleted the listing!')
    res.redirect('/parks');
}