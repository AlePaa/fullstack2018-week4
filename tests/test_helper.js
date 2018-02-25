const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = require('./test_blogs').blogs

const format = (blog) => {
  return {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    id: blog._id
  }
}

const nonExistingId = async () => {
  const blog = new Blog()
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blog = await Blog.find({})
  return blog.map(format)
}

const usersInDb = async () => {
  const users = await User.find({})
  return users
}
module.exports = {
  initialBlogs, format, nonExistingId, blogsInDb, usersInDb
}
