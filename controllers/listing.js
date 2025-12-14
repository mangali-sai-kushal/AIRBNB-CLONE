const Listing=require('../models/listing.js');


module.exports.index=async(req,res)=>{


  const allListings= await Listing.find({});
  
  res.render('listings/index.ejs',{allListings});
}
module.exports.renderNewForm=(req,res)=>{
  
  
  res.render('listings/new.ejs');
}
module.exports.showListing=async (req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id).populate({path:'reviews',populate:{ path:'author'}}).populate("owner");
  if(!listing){
    req.flash("error","cannot find that listing");
    return res.redirect('/listings');
    
  }
  console.log(listing);
  res.render('listings/show.ejs',{listing});
}

module.exports.createListing=async(req,res,next)=>{
   let url=req.file.path;
   let filename=req.file.filename;
   if(!req.body.listing.image || req.body.listing.image.trim() === ''){
    req.body.listing.image = 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60';
  }
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
  await newListing.save();
  
  //redirect to the show page of the new listing
  console.log('new listing created:',newListing);
  req.flash("success","new listing created successfully");
  res.redirect(`/listings/${newListing._id}`);
  
  
}
module.exports.renderEditForm=async(req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id);
  if(!listing){
    req.flash("error","cannot find that listing");
    return res.redirect('/listings');
  }
  let originalImageUrl=listing.image.url;
  originalImageUrl=originalImageUrl.replace('/upload','/upload/w_250');
  listing.image.url=originalImageUrl;
  res.render('listings/edit.ejs',{listing,originalImageUrl});
}
module.exports.updateListing=async(req,res)=>{
  
  let {id}=req.params;
  const updatedListing=await Listing.findByIdAndUpdate(id,{...req.body.listing},{new:true});
  if(typeof req.file!=='undefined'){
    let url=req.file.path;
    let filename=req.file.filename;
    updatedListing.image={url,filename};
  }
  
  await updatedListing.save();
  req.flash("success","listing updated successfully");
  res.redirect(`/listings/${updatedListing._id}`);
}
module.exports.destroyListing=async(req,res)=>{
  let {id}=req.params;
   let deletedListing=await Listing.findByIdAndDelete(id);
  req.flash("success","listing deleted successfully");
  res.redirect('/listings');
}