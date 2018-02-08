const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create(
	'blog post 1', 'my content 1', 'Zable1', Date.now()
);
BlogPosts.create(
	'blog post 2', 'my content 2', 'Zable2', Date.now()
);
BlogPosts.create(
	'blog post 3', 'my content 3', 'Zable3', Date.now()
);

router.get('/', (req, res) => {
	res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishDate'];
	for (let i=0; i < requiredFields.length; i++){
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message =`Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}	
	const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
	res.status(201).json(item);
});

router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted blog post item\`${req.params.ID}\``);
	res.status(204).end();
});


module.exports = router;

