const express = require('express')
const app = express()
const PORT = 8000

const elements = {
	typography: {
		h1: {},
		h2: {},
		h3: {},
		h4: {},
		h5: {},
		h6: {},
		p: {},
		a: {},
		figcaption: {},
	},
	buttons: {
		'.btn-primary': {},
		'.btn-secondary': {},
		'.btn-link-with-icon': {},
	},
}

app.get('/', (_, res) => res.sendFile(__dirname + '/index.html'))

// Read
app.get('/api/pieces/elements/:type', (req, res) => {
	const endpoint = req.params.type
	res.json(elements[endpoint])
})

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
