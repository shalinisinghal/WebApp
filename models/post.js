var mongoose = require('mongoose');

var PostSchema = mongoose.Schema({
	title: {
		type: String,
		index:true
	},
	category: {
		type: String
	},
	author: {
		type: String
	},
	body: {
		type: String
	},
	date: {
		type: String
	},
	mainimage: {
		type: String
	},
	comments:{
		type: Object
	}
},{collection: 'posts'});

var Post = module.exports = mongoose.model('Post', PostSchema);

module.exports.createPost = function(newPost, callback){
	        newPost.save(callback);
}