const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
const fs = require('fs')
const readline = require('readline')

// creates a JSON-object from the data file
const readFileData = async (path) => {
  const lines = []
  const fileStream = fs.createReadStream(path)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  for await (const line of rl) {
    lines.push(JSON.parse(line))
  }
  return lines
}

app.get('/', (req, res)=> {
  res.send('Specify resource')
})

app.get(`/:resource`, async (req, res) => {
  const resource = req.params.resource
  const data = await readFileData(`./resources/${resource}.source`)
  res.send(data)
})

app.get('/:resource/:id', async (req, res) => {
  const resource = req.params.resource
  const id = req.params.id
  const data = await readFileData(`./resources/${resource}.source`)
  const singleVaccination = data.find(vaccination => vaccination.id === id)
  res.send(singleVaccination)
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
})

//error handling
const errorHandler = (error, req, res, next) => {
  console.log('Error: ', error.name)
  console.log(error.message)
  next(error)
}
app.use(errorHandler)

//unknown endpoint
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' })
}
app.use(unknownEndpoint)