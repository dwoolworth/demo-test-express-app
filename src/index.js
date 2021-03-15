import path from 'path'
import { exit } from 'process'
import express from 'express'

const app = express()

const start = async () => {

  const host = '0.0.0.0'
  const port = 5000

  app.use(express.urlencoded({ limit: '100mb', extended: true }))
  app.use(express.json({ limit: '100mb' }))
  app.disable('x-powered-by')

  // Define static content folder
  app.use(express.static(path.join(__dirname, '/../', 'static')))

  // A single "controller" function, to search and/or retrieve all names
  const getNames = ({
    search
  }) => {
    const names = ['Derrick', 'Bhanu', 'Meenakshi', 'Preethesh', 'Ruturaj']
    const data = search
      ? names.filter(name => name.match(new RegExp(`^${search}`, 'i')))
      : names
    return {
      code: !data ? 404 : 200,
      data
    }    
  }

  // A "route" function, to intercept the URI and call the controller
  app.get('/api/names', (req, res) => {
    const { code, data } = getNames(req.query)
    return res.status(code).json(data)
  })

  const server = app.listen(port, host, () => {
    console.log(`[*] Server listening on http://${host}:${port}`)
  })

  const closeGracefully = (signal) => {
    console.log(` [x] Received signal to terminate: ${signal}`)
    server.close()
    exit(0)
  }

  process.on('SIGINT', closeGracefully)
  process.on('SIGTERM', closeGracefully)
}

start()
