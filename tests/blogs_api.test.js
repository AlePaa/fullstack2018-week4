const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { format, initialBlogs, nonExistingId, blogsInDb } = require('./test_helper')

describe('when there is initially some blogs saved', async () => {
  beforeAll(async () => {
    await Blog.remove({})

    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    await Promise.all(blogObjects.map(b => b.save()))

  })

  test('blogs are returned as json by GET /api/blogs', async () => {
    const blogsInDatabase = await blogsInDb()

    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(blogsInDatabase.length)

    const returnedTitles = response.body.map(b => b.title)
    blogsInDatabase.forEach(blog => {
        expect(returnedTitles).toContain(blog.title)
    })
  })

  test('individual blogs are returned as json by GET /api/blogs/:id', async () => {
    const blogsInDatabase = await blogsInDb()
    const aBlog = blogsInDatabase[0]

    const response = await api
      .get(`/api/blogs/${aBlog.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.type).toBe(aBlog.type)
  })

  test('a specific blog can be viewed', async () => {
    const resultAll = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const aBlogFromAll = resultAll.body[0]

    const resultBlog = await api
      .get(`/api/blogs/${aBlogFromAll.id}`)

    const blogObject = resultBlog.body

    expect(blogObject).toEqual(aBlogFromAll)
  })
  test('404 returned by GET /api/blogs/:id with nonexisting valid id', async () => {
    const validNonexistingId = await nonExistingId()

    const response = await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })

  test('400 is returned by GET /api/blogs/:id with invalid id', async () => {
    const invalidId = "5a3d5da59070081a82a3445"

    const response = await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })

  describe('addition of a new blog', async () => {

    test('POST /api/blogs succeeds with valid data', async () => {

      const blogsAtStart = await blogsInDb()

      const newBlog = {
        title: 'Ohjeita turhuuteen',
        author: 'alpa',
        url: "www.google.com"
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAfterOperation = await blogsInDb()

      expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)

      const titles = blogsAfterOperation.map(r => r.title)
      expect(titles).toContain('Ohjeita turhuuteen')
    })

    test('POST /api/blogs fails with proper statuscode if title or url is missing ', async () => {
      const newBlog = {
        author: 'apla',
        url: "www.google.com"
      }

      const blogsAtStart = await blogsInDb()

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ')
        .expect(400)

      const newerBlog = {
        author: 'apla',
        title: 'ei pitäisi toimia'
      }

      await api
        .post('/api/blogs')
        .send(newerBlog)
        .expect(400)

      const blogsAfterOperation = await blogsInDb()

      expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
    })

    test('when adding blogs, not giving likes sets it to zero', async () => {
      const newBlog = {
        title: 'Ei juurikaan pidetä',
        author: 'alpa',
        url: "www.google.com"
      }

      await api
        .post('/api/blogs')
        .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAfterOperation = await blogsInDb()

      const blog = blogsAfterOperation
        .find((blog) => blog.title === 'Ei juurikaan pidetä')
      expect(blog.likes).toBe(0)
    })
  })

  describe('deletion and updating of a blog', async () => {
    let addedBlog

    beforeAll(async () => {
      addedBlog = new Blog({
        author: 'apla',
        title: 'Poisto!',
        url: "www.google.com"
      })
      await addedBlog.save()
    })

    test('DELETE /api/blogs/:id succeeds with proper statuscode', async () => {
      const blogsAtStart = await blogsInDb()

      await api
        .delete(`/api/blogs/${addedBlog._id}`)
        .expect(204)

      const blogsAfterOperation = await blogsInDb()

      const titles = blogsAfterOperation.map(r => r.title)

      expect(titles).not.toContain(addedBlog.title)
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length - 1)
    })

    test('PUT /api/blogs/:id succeeds with proper statuscode', async () => {
      const blogsAtStart = await blogsInDb()

      updatedBlog = new Blog({
        author: 'apla',
        title: 'Päivitys!',
        url: "www.google.com"
      })

      await api
        .put('/api/blogs/${addedBlog._id}')
        .send(updatedBlog)
        .expect(200)

      const blogsAfterOperation = await blogsInDb()

      const titles = blogsAfterOperation.map(r => r.title)

      expect(titles).not.toContain(addedBlog.title)
      expect(titles).toContain(updatedBlog.title)

    })
  })

  afterAll(() => {
    server.close()
  })
})
