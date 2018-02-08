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



module.exports = router;

