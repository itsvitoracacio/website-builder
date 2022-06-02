const express = require('express')
const app = express()
const PORT = 8000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Class that all served files belong to
class File {
	constructor(fileAddress) {
		this.fileAddress = fileAddress
	}
	serveFile() {
		app.get(this.fileAddress, (_, res) =>
			res.sendFile(__dirname + this.fileAddress)
		)
	}
}

// Creating and serving page files and auxiliary files
app.get('/', (_, res) => res.sendFile(__dirname + '/index.html'))
const cssNormalize = new File('/css/normalize.css')
const cssStyle = new File('/css/style.css')
const cssAppHeader = new File('/css/app-header.css')
const jsMain = new File('/js/main.js')
cssNormalize.serveFile()
cssStyle.serveFile()
cssAppHeader.serveFile()
jsMain.serveFile()

// Creating and serving image files
const homeIcon = new File('/assets/home-icon.svg')
const profilePic = new File('/assets/profile-picture.svg')
const clientPic = new File('/assets/client-picture.svg')
homeIcon.serveFile()
profilePic.serveFile()
clientPic.serveFile()

// API endpoints
const ELEMENTS_ENDPOINT = '/api/pieces/elements/:type'

// Database
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

// Processing http requests for files that are stored in the database
function processRequest(req, res, method) {
	const type = req.params.type
	const { tag, name, cssProps } = req.body

	const elementsWithTag = elements[type][tag]
	const elemExists = name in elementsWithTag

	// Creating the element if it doesn't exist yet
	const methodIsPost = method === 'POST'
	if (methodIsPost && !elemExists) elementsWithTag[name] = {}

	// Updating the element's cssProps
	const methodIsPut = method === 'PUT'
	if (methodIsPut && elemExists) elementsWithTag[name].cssProps = cssProps

	// Deleting the element
	const methodIsDelete = method === 'DELETE'
	if (methodIsDelete && elemExists) delete elementsWithTag[name]

	res.json(elements[type][tag])
}

app.get(ELEMENTS_ENDPOINT, (req, res) => res.json(elements[req.params.type]))
app.post(ELEMENTS_ENDPOINT, (req, res) => processRequest(req, res, 'POST'))
app.put(ELEMENTS_ENDPOINT, (req, res) => processRequest(req, res, 'PUT'))
app.delete(ELEMENTS_ENDPOINT, (req, res) => processRequest(req, res, 'DELETE'))

// Turning on the server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
