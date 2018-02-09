const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Comments} = require('./comments_models');

Comments.create(
	'comment1', 'user1', Date.now()
);
Comments.create(
	'comment2', 'user2', Date.now()
);
Comments.create(
	'comment3', 'user3', Date.now()
)

