const createH1Btn = document.querySelector('#create-h1')
createH1Btn.addEventListener('click', createH1)

function createH1() {
	createElem('h1', '.alt-h1')
}

async function createElem(elem, elemName) {
	try {
		const res = await fetch('/api/pieces/elements/typography', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ tag: elem, name: elemName, cssProps: {} }),
		})
		const data = res.json()
		// do something with data
	} catch (err) {
		console.log(err)
	}
}
