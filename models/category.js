var mongoose = require('mongoose');

var CategorySchema = mongoose.Schema({
	title: {type: String}
	},{collection: 'categories'});

var Category = module.exports = mongoose.model('Category', CategorySchema);

module.exports.createCategory = function(newCategory, callback){
	        newCategory.save(callback);
}