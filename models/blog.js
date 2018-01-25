const mongoose = require('mongoose')

const mongoUrl = 'mongodb://dev:salainen@ds213118.mlab.com:13118/fullstack2018'

mongoose.connect(mongoUrl)
mongoose.Promise = global.Promise

const Blog = mongoose.model('Blog', {
  title: String,
  author: String,
  url: String,
  likes: Number
})

module.exports = Blog
