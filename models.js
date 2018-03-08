
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// This module provides volatile storage, using a `BlogPost`
// model. We haven't learned about databases yet, so for now
// we're using in-memory storage. This means each time the app stops, our storage
// gets erased.

// Don't worry too much about how BlogPost is implemented.
// Our concern in this example is with how the API layer
// is implemented, and getting it to use an existing model.


const BlogPostsSchema = mongoose.Schema({
      title: {type: String, required: true},
      content: {type: String, required: true},
      author: {type: String, required: true},
      publishDate: {type: Date, default: Date.now}
});

BlogPostsSchema.methods.serialize = function() {
  return {
    title: this.title,
    content: this.content,
    author: this.author,
    publishDate: this.publishDate
  };
}

const BlogPost = mongoose.model('BlogPost', BlogPostsSchema);

module.exports = {BlogPost};