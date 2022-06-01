const express = require('express')
const app = express()
const PORT = 8000

app.get('/', (_, res) => res.sendFile(__dirname + '/index.html'))
app.get('/api/:param', (req, res) =>
	res.json(`You queried: ${req.params.param}`)
)

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
