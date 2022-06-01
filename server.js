const express = require('express')
const app = express()
const cors = require('cors')
const PORT = 8000

app.use(cors())

app.get('/', (_, res) => res.sendFile(__dirname + '/index.html'))
app.get('/api:param', (req, res) => res.json(`You queried ${req.params.param}`))

app.listen(process.env.PORT || PORT, (_, _) => {
	console.log(`Server running on port ${PORT}`)
})