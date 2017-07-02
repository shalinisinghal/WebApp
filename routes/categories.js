var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var mongoose = require('mongoose');

var Category = require('../models/category');
var Post = require('../models/post');

//add post
router.get('/add', function(req, res){
		res.render('addcategory',{
			"title":"Add category",
		});
});

router.get('/show/:category', function(req, res){
		Post.find({category:req.params.category},{},function (err, posts) {
			res.render('blog',{
				"title":req.params.category,
				"posts":posts
			});
		});
});

router.post('/add', function(req, res){

	var title=req.body.title;

	req.checkBody("title","title field is required").notEmpty();

	var errors=req.validationErrors();

	if(errors){
		res.render('addcategory',{
			"errors":errors,
			"title":title
		});
	}else{
		var newCategory = new Category({
			"title":title,
		});

		Category.createCategory(newCategory, function(err, category){
			if(err) throw err;
		});
		//req.flash('success-msg','category submitted');
		res.redirect('/users/blog');
	}
});

module.exports = router;