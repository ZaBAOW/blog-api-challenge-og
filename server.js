const express = require('express');
const morgan = require('morgan');

const app =  express();

const blogPostRouter = require('./blogPostRouter');
// const commentRouter = require('./commentRouter');

app.use(morgan('common'));

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/view/index.html');
});

app.use('/blog-posts', blogPostRouter);
// app.use('/comments', commentRouter);

app.listen(process.env.PORT || 8080, () => {
	console.log(`The app is listening on port ${process.env.PORT || 8080}`);
});

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
