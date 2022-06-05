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
const cssEditSidebar = new File('/css/edit-sidebar.css')
const cssWorkingArea = new File('/css/working-area.css')
const jsMain = new File('/js/main.js')
const jsSidebar = new File('/js/sidebar.js')
cssNormalize.serveFile()
cssStyle.serveFile()
cssAppHeader.serveFile()
cssEditSidebar.serveFile()
cssWorkingArea.serveFile()
jsMain.serveFile()
jsSidebar.serveFile()

// Creating and serving image files
const homeIcon = new File('/assets/home-icon.svg')
const profilePic = new File('/assets/profile-picture.svg')
const clientPic = new File('/assets/client-picture.svg')
const chevronIcon = new File('/assets/right-chevron.svg')
homeIcon.serveFile()
profilePic.serveFile()
clientPic.serveFile()
chevronIcon.serveFile()

// API endpoints
const EDIT_PIECETYPE_ENDPOINT = '/api/pieces/elements/:type'
const EDIT_PARENTSELECTOR_ENDPOINT =
	'/api/pieces/elements/:type/:parentSelector'

// Database
const db = {
	typography: {
		h1: {
			h1: {},
			'bright-bg': {},
			'dark-bg': {},
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
	const { selector, name, cssProps } = req.body

	// const elementsWithTag = elements[type][selector]
	// const elemExists = name in elementsWithTag

	// // Creating the element if it doesn't exist yet
	// const methodIsPost = method === 'POST'
	// if (methodIsPost && !elemExists) elementsWithTag[name] = {}

	// // Updating the element's cssProps
	// const methodIsPut = method === 'PUT'
	// if (methodIsPut && elemExists) elementsWithTag[name].cssProps = cssProps

	// // Deleting the element
	// const methodIsDelete = method === 'DELETE'
	// if (methodIsDelete && elemExists) delete elementsWithTag[name]

	res.json(elements[type][selector])
}

app.get(EDIT_PIECETYPE_ENDPOINT, (req, res) => res.json(db[req.params.type]))
app.get(EDIT_PARENTSELECTOR_ENDPOINT, (req, res) => {
	const param = req.params
	res.json(db[param.type][param.parentSelector])
})

// app.post(ELEMENTS_ENDPOINT, (req, res) => processRequest(req, res, 'POST'))
// app.put(ELEMENTS_ENDPOINT, (req, res) => processRequest(req, res, 'PUT'))
// app.delete(ELEMENTS_ENDPOINT, (req, res) => processRequest(req, res, 'DELETE'))

// Turning on the server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
