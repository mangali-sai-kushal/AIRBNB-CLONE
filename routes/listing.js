const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync');
const { listingSchema} = require('../schema.js');
const ExpressError=require('../utils/ExpressError');
const Listing=require('../models/listing.js');
const { isLoggedIn, isOwner ,validateListing} = require('../middleware.js');
const listingController=require("../controllers/listing.js");
const multer=require('multer');
const { storage } = require('../cloudConfig.js'); 

const upload=multer({storage});

router.route("/")
.get(wrapAsync(listingController.index))
.post(
  isLoggedIn,
  upload.single('listing[image]'),
    validateListing,

  wrapAsync(listingController.createListing)
);

router.get('/new',isLoggedIn,listingController.renderNewForm);


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
  isLoggedIn,
  isOwner,
    upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.updateListing)
)
.delete(
  isLoggedIn,
  isOwner,wrapAsync(listingController.destroyListing)
);




//index route to show all listings

//new route to show form to create new listing
//show route to show details of a specific listing

//create route to add new listing to the database 
//edit route to show form to edit a specific listing
router.get('/:id/edit',
  isLoggedIn,
  isOwner
  ,wrapAsync(listingController.renderEditForm));
//update route to update a specific listing
//delete route to delete a specific listing
module.exports=router;