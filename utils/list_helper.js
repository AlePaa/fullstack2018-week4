const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (acc, blog) => {
    return acc + blog.likes
  }
 return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (top, blog) => {
    return (blog.likes > top.likes) ? blog : top
  }
  return blogs.length === 0 ? undefined : blogs.reduce(reducer)
}

const mostBlogs = (blogs) => {
  const getMostBlogs = (blogs) => {
    const authors = {}
    let most = undefined
    blogs.map(blog => {
      if (authors[blog.author] === undefined)
        authors[blog.author] = {'author': blog.author, 'blogs': 1}
      else
        authors[blog.author].blogs++
      if (most === undefined || most.blogs < authors[blog.author].blogs)
        most = authors[blog.author]
    })
    return most
  }
  return blogs.length === 0 ? undefined : getMostBlogs(blogs)
}

const mostLikes = (blogs) => {
  const getMostLikes = (blogs) => {
    const authors = {}
    let most = undefined
    blogs.map(blog => {
      if (authors[blog.author] === undefined)
        authors[blog.author] = {'author': blog.author, 'votes': blog.likes}
      else
        authors[blog.author].votes += blog.likes
      if (most === undefined || most.votes < authors[blog.author].votes)
        most = authors[blog.author]
    })
    return most
  }
  return blogs.length === 0 ? undefined : getMostLikes(blogs)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
