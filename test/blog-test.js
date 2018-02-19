const chai = require('chai');
const chaiHTTP = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHTTP);

describe('Blogpost List', function(){
	before(function(){
		return runServer();
	});

	after(function(){
		return closeServer();
	});

	it('Should list Blogposts on GET', function(){
		return chai.request(app).get('/blog-posts').then(function(res){
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body).to.be.a('array');
			expect(res.body.length).to.be.at.least(1);

			const expectKeys = ['id', 'title', 'content', 'author', 'publishDate'];
			res.body.forEach(function(item){
				expect(item).to.be.a('object');
				expect(item).to.include.keys(expectKeys);
			});
		});
	});

	it('Should add a Blogpost on POST', function(){
		const newBlogPost = ({'title': 'new title', 'content': 'new content', 'author': 'new Zabel', 'publishDate': Date.now()})
		return chai.request(app).post('/blog-posts').send(newBlogPost).then(function(res){
			expect(res).to.have.status(201);
			expect(res).to.be.json;
			expect(res.body).to.be.a('object');
			expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
			expect(res.body.id).to.not.equal(null);

			expect(res.body).to.deep.equal(Object.assign(newBlogPost, {id: res.body.id}));
		});
	});

	it('Should update Blogposts on PUT', function(){
		const updateData = {
			title: 'update title',
			content: 'update content',
			author: 'update author',
			publishDate: Date.now()
		};
		return chai.request(app).get('/blog-posts').then(function(res){
			update.id = res.body[0].id;
			return chai.request(app).put(`/blog-posts/${updateData}`).send(updateData)
		}).then(function(res){
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res).to.be.a('object');
			expect(res).to.deep.equal(updateData);
		}).catch(function(err){
			console.log(err);
		});
	});

	it('Should delete recipes on DELETE', function(){
		return chai.request(app).get('/blog-posts').then(function(res){
			return chai.request(app).delete(`blog-posts/${res.body[0].id}`);
		}).then(function(res){
			expect(res).to.have.status(204);
		})
	})
});
