'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = requer('mongoose');

mongoose.Promise = global.Promise;

const app =  express();

const {PORT, DATABASE, URL} = require('./config');
const blogPostRouter = require('./blogPostRouter');
// const commentRouter = require('./commentRouter');

app.use(morgan('common'));

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/view/index.html');
});

app.use('/blog-posts', blogPostRouter);
// app.use('/comments', commentRouter);

function runServer(){
	const port  = process.env.PORT || 8080;
	return new Promise((resolve, reject) => {
		server = app.listen(port, ()=> {
			console.log(`Your app is listening on port ${port}`);
			resolve(server);
		}).on('error', err =>{
			reject(err)
		});
	});
}	

function closeServer() {
	return new Promise((resolve, reject) => {
		server.close(err => {
			if (err) {
				reject(err);

				return;
			}
			resolve();
		});
	});
}

if (require.main === module) {
	runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
