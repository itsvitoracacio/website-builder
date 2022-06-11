const express = require('express')
const app = express()
const PORT = 8000

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Setting page routes
app.get('/', (_, res) => res.sendFile(__dirname + '/index.html'))

// API endpoints
const EDIT_PIECETYPE_ENDPOINT = '/api/pieces/elements/:type'
const EDIT_PARENTSELECTOR_ENDPOINT =
	'/api/pieces/elements/:type/:parentSelector'

// Database
const db = {
	typography: {
		h1: {
			h1: [
				{ 'font-size': '1rem' },
				{ 'line-height': '1.35rem' },
				{ 'text-align': 'center' },
			],
			'bright-bg': [
				{ color: 'black' },
				{ 'background-color': 'white' },
				{ display: 'block' },
			],
			'dark-bg': [
				{ color: 'black' },
				{ 'background-color': 'white' },
				{ display: 'inline-block' },
			],
		},
		h2: {},
		h3: {},
		h4: {},
		h5: {
			h5: {},
			'bright-bg': {},
			'dark-bg': {},
		},
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

// Processing http requests for files that are stored in the database
function processRequest(req, res, method) {
	const type = req.params.type
	const parentSelector = req.params.parentSelector
	const { variantName, cssRules } = req.body

	const piecesOfSelectorInDb = db[type][parentSelector]
	const variantDoesExist = variantName in piecesOfSelectorInDb

	// // Creating the element if it doesn't exist yet
	const methodIsPost = method === 'POST'
	if (methodIsPost && !variantDoesExist) piecesOfSelectorInDb[variantName] = {}

	// // Updating the element's cssRules
	const methodIsPut = method === 'PUT'
	if (methodIsPut && variantDoesExist) piecesOfSelectorInDb[variantName] = cssRules

	// Deleting the element
	const methodIsDelete = method === 'DELETE'
	if (methodIsDelete && variantDoesExist)
		delete piecesOfSelectorInDb[variantName]

	res.json(piecesOfSelectorInDb)
}

app.get(EDIT_PIECETYPE_ENDPOINT, (req, res) => res.json(db[req.params.type]))

app.get(EDIT_PARENTSELECTOR_ENDPOINT, (req, res) => {
	const param = req.params
	res.json(db[param.type][param.parentSelector])
})

app.post(EDIT_PARENTSELECTOR_ENDPOINT, (req, res) =>
	processRequest(req, res, 'POST')
)

app.put(EDIT_PARENTSELECTOR_ENDPOINT, (req, res) =>
	processRequest(req, res, 'PUT')
)

app.delete(EDIT_PARENTSELECTOR_ENDPOINT, (req, res) =>
	processRequest(req, res, 'DELETE')
)

// Turning on the server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
