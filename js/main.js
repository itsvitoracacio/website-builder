const TYPOGRAPHY_ENDPOINT = '/api/pieces/elements/typography'

const createH1Btn = document.querySelector('#create-h1')
createH1Btn.addEventListener('click', createH1)

const saveH1Btn = document.querySelector('#save-h1')
saveH1Btn.addEventListener('click', saveH1)

function createH1() {
	createPiece('h1', '.alt-h1')
}

function saveH1() {
	savePiece('h1', '.alt-h1')
}

async function createPiece(elem, elemName) {
	try {
		const res = await fetch(TYPOGRAPHY_ENDPOINT, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				tag: elem,
				name: elemName,
				cssProps: {},
			}),
		})
		const data = res.json()
		// do something with data
	} catch (err) {
		console.log(err)
	}
}

async function savePiece(elem, elemName) {
	try {
		const res = await fetch(TYPOGRAPHY_ENDPOINT, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				tag: elem,
				name: elemName,
				cssProps: {},
			}),
		})
		const data = res.json()
		// do something with data
	} catch (err) {
		console.log(err)
	}
}
