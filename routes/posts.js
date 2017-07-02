var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var mongoose = require('mongoose');
var multer  = require('multer');

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './public/images/uploads')
  },
  filename: function(req, file, callback) {
    console.log(file)
    callback(null, file.originalname)
  }
});
var upload = multer({storage: storage});

var Category = require('../models/category');
var Post = require('../models/post');

//add post
router.get('/add', function(req, res){
	Category.find({},{},function (err, categories) {
		res.render('addpost',{
			"title":"Add Post",
			"categories":categories
		});
	});
});

router.get('/show/:id', function(req, res){
	Post.findById(req.params.id,function (err, post) {
		res.render('show',{
			"post":post
		});
	});
});

router.post('/add', upload.single('mainimage'), function(req, res){

	var title	=req.body.title;
	var category=req.body.category;
	var body	=req.body.body;
	var author	=req.user.name;
	var date 	=new Date();

	if(req.file)
		var mainImageName=req.file.filename;	
	else
		var mainImageName='noimage.png';

	req.checkBody("title","title field is required").notEmpty();
	req.checkBody("body","Body field is required");

	var errors=req.validationErrors();

	if(errors){
		res.render('addpost',{
			"errors":errors,
			"title":title,
			"body":body
		});
	}else{

		var newPost = new Post({
			"title":title,
			"body":body,
			"category":category,
			"author":author,
			"date":date,
			"mainimage":mainImageName
		});

		Post.createPost(newPost, function(err, post){
			if(err) throw err;
		});

		res.redirect('/users/blog');
	}
});

router.post('/addcomment', function(req, res){

	var name	=req.body.name;
	var email	=req.body.email;
	var body 	=req.body.body;
	var postid	=req.body.postid;
	var commentdate=new Date();

	req.checkBody("name","Name field is required").notEmpty();
	req.checkBody("email","Email field is required").notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody("body","Body field is required").notEmpty();

	var errors=req.validationErrors();

	if(errors){
		Post.findById(postid,function(err,post){
			res.render('show',{
				"errors":errors,
				"post":post
			});
		})
	}else{

		var comment ={"name":name,"email":email,"body":body,"commentdate":commentdate};

		Post.update( {"_id":postid},
			{$push:{ "comments":comment}},
			function(err,doc){
			if(err)
				throw err;
			else{
				req.flash('success_msg','comment added');
				res.location('/posts/show/'+postid);
				res.redirect('/posts/show/'+postid);
			}
		}
		);
	}
});

module.exports = router;