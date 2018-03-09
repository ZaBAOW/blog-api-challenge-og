const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');

const {BlogPosts} = require('./models');

//comment added to check gitbash push

// BlogPosts.create(
// 	'blog post 1', 'my content 1', 'Zable1', Date.now()
// );
// BlogPosts.create(
// 	'blog post 2', 'my content 2', 'Zable2', Date.now()
// );
// BlogPosts.create(
// 	'blog post 3', 'my content 3', 'Zable3', Date.now()
// );

router.get('/', (req, res) => {
	BlogPosts.find().then(BlogPosts => {
		res.json({
			BlogPosts: BlogPosts.map((BlogPosts) => BlogPosts.serialize())
		});
	});
});

router.get('/:id', (req, res) => {
	BlogPosts.findById(req.params.id).then(BlogPosts => res.json(BlogPosts.serialize())).catch(err => {
		console.log(err);
		res.status(500).json({message: 'Internal service error'});
	});
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishDate'];
	for(i= 0; i < requiredFields.length; i++){
		const field = requiredFields[i];
		if (!(field in req.body)){
			const message = (`Missing\`${field}\`in request body`);
			console.error(message);
			return res.status(400).send(message);
		}
	}

	BlogPosts.create({
		title: res.body.title,
		content: res.body.content,
		author: res.body.author,
		publishDate: Date.now()
	}).then(posts => res.status(201).json(posts.title)).catch(err => {
		console.log(err)
		res.status(500).json({message: 'Internal server error'});
	})
});


router.delete('/:id', (req, res) => {
	BlogPosts.findByIdAndRemove(req.params.id).then(BlogPosts => res.status(204).end()).catch(err => res.status(500).json({ message: 'Internal server error'}));
});

router.put('/:id', jsonParser, (req, res) => {
	if(!(req.params.id && req.body.id && req.params.id === req.body.id)){
		const message = (`Request path id (${req.params.id}) and the request body id (${req.body.id}) must match`);
		console.error(message);
		return res.status(400).json({message: message});
	}

	const toUpdate = {}
	const updateFields = ['title', 'content', 'author', 'publishDate'];

	updateFields.forEach (field => {
		if (field in req.body) {
			toUpdate[field] = req.body[field];
		}
	});

	BlogPosts.findByIdAndUpdate(req.params.id, { $set: toUpdate }).then(BlogPosts => res.status(204).end()).catch(err => res.status(500).json( {message: 'Internal server error'}));
});

module.exports = router;

