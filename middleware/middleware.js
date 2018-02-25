const logger = (request, response, next) => {
  if ( process.env.NODE_ENV === 'test' ) {
    return next()
  }
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const error = (request, response, next) => {
  response.status(404).send({ error: 'unknown endpoint' })
  next()
}

const tokenExtractor = (request, response, next) => {
  const authorization = (request.headers['authorization'])
  if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request['token'] = authorization.substring(7)
  }
  next()
}

module.exports = {
  logger,
  error,
  tokenExtractor
}
