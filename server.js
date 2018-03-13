'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const app =  express();

const {DATABASE_URL, PORT} = require('./config');
const {BlogPost} = require('./models');

app.use(morgan('common'));

app.use(express.static('public'));
app.use(bodyParser.json());


app.get('/blog-posts', (req, res) => {
	return BlogPost.find().then(blogposts => {
		res.json({
			BlogPosts: blogposts.map((post) => post.serialize())
		});
	});
});

app.get('/blog-posts/:id', (req, res) => {

	return BlogPosts.findById(req.params.id).then(post => res.json(post.serialize())).catch(err => {

		console.log(err);
		res.status(500).json({message: 'Internal service error'});
	});
});

app.post('/blog-posts', (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishDate'];
	for(let i= 0; i < requiredFields.length; i++){
		const field = requiredFields[i];
		if (!(field in req.body)){
			const message = (`Missing\`${field}\`in request body`);
			console.error(message);
			return res.status(400).send(message);
		}
	}

	BlogPost.create({
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
	}).then(function(post) {
		console.log("POST = ", post);
		res.status(201).json(post.serialize())
	}).catch(err => {
		console.log(err)
		res.status(500).json({message: 'Internal server error'});
	})
});



app.delete('/blog-posts/:id', (req, res) => {
	
	return BlogPost.findByIdAndRemove(req.params.id)
		.then(post => res.status(204).end())
		.catch(function(err) {
			console.log("ERR = ", err);
			res.status(500).json(
				{ message: 'Internal server error: ' + err}
			)
		});
});

app.put('/blog-posts/:id', (req, res) => {
	console.log("PUT REQ PARAMS = ", req.params);
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
	console.log("About to Update!");

	BlogPost.findByIdAndUpdate(req.params.id, { $set: toUpdate })
		.then(post => res.status(204).json({}))
		.catch(err => res.status(500).json( {message: 'Internal server error: ' + err}));

});

let server;

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
	runServer(DATABASE_URL).catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
