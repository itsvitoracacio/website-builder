const express = require('express')
const app = express()
const PORT = 8000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Page & auxfiles requests
app.get('/', (_, res) => res.sendFile(__dirname + '/index.html'))
app.get('/js/main.js', (_, res) => res.sendFile(__dirname + '/js/main.js'))

// API endpoints
const ELEMENTS_ENDPOINT = '/api/pieces/elements/:type'

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

function processRequest(req, res, method) {
	const type = req.params.type
	const { tag, name, cssProps } = req.body

	const elementsWithTag = elements[type][tag]
	const elemExists = name in elementsWithTag

	const methodIsPost = method === 'POST'
	const methodIsPut = method === 'PUT'
	const methodIsDelete = method === 'DELETE'

	if (methodIsPost && !elemExists) elementsWithTag[name] = cssProps
	if (methodIsPut && elemExists) elementsWithTag[name].cssProps = cssProps
	if (methodIsDelete && elemExists) delete elementsWithTag[name]

	res.json(elements[type][tag])
}

app.get(ELEMENTS_ENDPOINT, (req, res) => res.json(elements[req.params.type]))
app.post(ELEMENTS_ENDPOINT, (req, res) => processRequest(req, res, 'POST'))
app.put(ELEMENTS_ENDPOINT, (req, res) => processRequest(req, res, 'PUT'))
app.delete(ELEMENTS_ENDPOINT, (req, res) => processRequest(req, res, 'DELETE'))

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
