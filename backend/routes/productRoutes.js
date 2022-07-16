const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Review = require("../models/review");
const {isLoggedIn} = require('../middleware');

// Get all the products
router.get("/products", async(req, res) => {

  try{

    const products = await Product.find({});
    res.render("products/index" , {products});

  }catch(e) {
    req.flash('error','oops something went wrong');
    res.redirect('/error');
  }
});

//add new products
router.get("/products/new",isLoggedIn, (req,res) => {
  res.render("products/new")
});

//add info about new product through post request
router.post("/products",isLoggedIn, async(req,res)=>{
  try{
    const newProduct ={
      ...req.body
    }
  
    await Product.create(newProduct);
  
    req.flash('success','Product Created Successfully!!');
    res.redirect("/products");
  }
  catch(e) {
    req.flash('error','oops something went wrong');
    res.redirect('/error');
  }
  
});

// show the selected product (show page)
router.get("/products/:id", async(req,res)=>{
  try{
    const {id} = req.params;
    const product = await Product.findById(id).populate('reviews');
    res.render("products/show",{product});
  }
  catch(e) {
    req.flash('error','oops something went wrong');
    res.redirect('/error');
  }
});

//edit 
router.get("/products/:id/edit",isLoggedIn, async(req,res) => {
  try {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render("products/edit",{product});
  }
  catch(e){
    req.flash('error','oops something went wrong');
    res.redirect('/error');
  }
})

//update the edited product
router.patch("/products/:id",isLoggedIn, async(req,res)=>{
  try{
    const updatedProduct = req.body;
    const{id} = req.params;
    await Product.findByIdAndUpdate(id,updatedProduct);
    res.redirect(`/products/${id}`);
  }
  catch(e){
    req.flash('error','oops something went wrong');
    res.redirect('/error');
  }
})

//delete
router.delete('/products/:id',isLoggedIn,async(req,res)=>{
  try{
    const {id} = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
  }
  catch(e){
    req.flash('error','oops something went wrong');
    res.redirect('/error');
  }
})

//creating a review for each product
router.post('/products/:id/review',isLoggedIn ,async(req,res)=>{


  // if(!req.isAuthenticated()) {
  //   req.flash('error','You need to login first to add a review');
  //   return res.redirect('/login');
  // }

  try{
    const {id} = req.params;
    const product = await Product.findById(id);
    const { rating, comment } = req.body;

    const review = new Review({ rating , comment , user:req.user.username });
    product.reviews.push(review);

    await product.save();
    await review.save();

    req.flash('success','Successfully created your review!!');

    res.redirect(`/products/${id}`);
  }
  catch(e){
    req.flash('error','oops something went wrong');
    res.redirect('/error');
  }

  // console.log(req.body);
  // res.send("Review Route");
});

router.delete('/products/:id/review/remove',isLoggedIn,async(req,res)=>{
    // const reviewId = req.params.id;
    // const review = reviews.findById(id);
    // const product = await Product.findById(id);
    // const userid = req.user._id;

  // const reviewId = await product.reviews.findById();

  // await product.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  // res.redirect(`/products/${reviewId}`);
  console.log(req.body);
  // res.send("");
});

//display reviews


module.exports = router;
