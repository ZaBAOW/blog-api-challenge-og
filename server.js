'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const app =  express();

const {PORT, DATABASE_URL} = require('./config');
const blogPostRouter = require('./blogPostRouter');
// const commentRouter = require('./commentRouter');

app.use(morgan('common'));

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/view/index.html');
});

app.use('/blog-posts', blogPostRouter);
// app.use('/comments', commentRouter);

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
