const listHelper = require('../utils/list_helper')
const blogs = require('./test_blogs').blogs

  test('dummy is called', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })

  describe('totalLikes', () => {
    const totalLikes = listHelper.totalLikes

    test('of empty list is zero', () => {
      const result = totalLikes([])
      expect(result).toBe(0)
    })

    test('of nonempty list is correct', () => {
      const result = totalLikes(blogs)
      expect(result).toBe(36)
    })
  })

  describe('favoriteBlog', () => {
    const favoriteBlog = listHelper.favoriteBlog

    test('of empty list is returned correctly', () => {
      const result = favoriteBlog([])
      expect(result).toEqual(undefined)
    })

    test('of nonempty list is returned correctly', () => {
      const target = {
          _id: "5a422b3a1b54a676234d17f9",
          title: "Canonical string reduction",
          author: "Edsger W. Dijkstra",
          url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
          likes: 12,
          __v: 0
      }
      const result = favoriteBlog(blogs)
      expect(result).toEqual(target)
    })
  })

  describe('mostBlogs', () => {
    const mostBlogs = listHelper.mostBlogs

    test('of empty list is returned correctly', () => {
      const result = mostBlogs([])
      expect(result).toEqual(undefined)
    })

    test('of nonempty list is returned correctly', () => {
      const target = {
        author: "Robert C. Martin",
        blogs: 3
      }
      const result = mostBlogs(blogs)
      expect(result).toEqual(target)
    })
  })

  describe('mostLikes', () => {
    const mostLikes = listHelper.mostLikes

    test('of empty list is returned correctly', () => {
      const result = mostLikes([])
      expect(result).toEqual(undefined)
    })

    test('of nonempty list is returned correctly', () => {
      const target = {
        author: "Edsger W. Dijkstra",
        votes: 17
      }
      const result = mostLikes(blogs)
      expect(result).toEqual(target)
    })
})
