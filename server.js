'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const app =  express();

const {PORT, DATABASE_URL} = require('./config');
const {BlogPosts} = require('./models');
// const blogPostRouter = require('./blogPostRouter');
// const commentRouter = require('./commentRouter');

app.use(morgan('common'));

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/view/index.html');
});

// app.use('/blog-posts', blogPostRouter);
// app.use('/comments', commentRouter);

app.get('/', (req, res) => {
	BlogPosts.find().then(BlogPosts => {
		res.json({
			BlogPosts: BlogPosts.map((BlogPosts) => BlogPosts.serialize())
		});
	});
});

app.get('/:id', (req, res) => {
	BlogPosts.findById(req.params.id).then(BlogPosts => res.json(BlogPosts.serialize())).catch(err => {
		console.log(err);
		res.status(500).json({message: 'Internal service error'});
	});
});

app.post('/', (req, res) => {
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
		publishDate: res.body.Date.now()
	}).then(BlogPosts => res.status(201).json(BlogPosts.serialize())).catch(err => {
		console.log(err)
		res.status(500).json({message: 'Internal server error'});
	})
});


app.delete('/:id', (req, res) => {
	BlogPosts.findByIdAndRemove(req.params.id).then(BlogPosts => res.status(204).end()).catch(err => res.status(500).json({ message: 'Internal server error'}));
});

app.put('/:id', (req, res) => {
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

function runServer(databaseUrl = DATABASE_URL, port = PORT){
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if(err) {
				return reject(err);
			}
			server = app.listen(port, () => {
				console.log(`Your app is listening on port ${port}`);
				resolve();
			}).on('error', err => {
				mongoose.disconnect();
				reject(err);
			});
		});
	});
	
}	

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {
	runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
