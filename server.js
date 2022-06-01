const express = require('express')
const app = express()
const PORT = 8000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
app.get('/js/main.js', (_, res) => res.sendFile(__dirname + '/js/main.js'))

// Create
app.post('/api/pieces/elements/:type', (req, res) => {
	const type = req.params.type
	const { tag, name, cssProps } = req.body
	const elementsWithCurrentTag = elements[type][tag]
	const itAlreadyExists = name in elementsWithCurrentTag
	if (itAlreadyExists) console.log('An element with this name already exists')
	else {
		elementsWithCurrentTag[name] = cssProps
		console.log(`'${name}', a new instance of ${tag} has been created`)
	}
	res.json(elements[type][tag])
})

// Read
app.get('/api/pieces/elements/:type', (req, res) => {
	const type = req.params.type
	res.json(elements[type])
})

// Update
app.put('/api/pieces/elements/:type', (req, res) => {
	const type = req.params.type
	const { tag, name, cssProps } = req.body
	const elementsWithCurrentTag = elements[type][tag]
	const itAlreadyExists = name in elementsWithCurrentTag
	if (itAlreadyExists) {
		elementsWithCurrentTag[name].cssProps = cssProps
		console.log(`${name}', an instance of ${tag} has been updated`)
	} else {
		console.log(`There isn't any element called '${name}' yet`)
	}
	res.json(elements[type][tag])
})

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
