const TYPOGRAPHY_ENDPOINT = '/api/pieces/elements/typography'

const createH1Btn = document.querySelector('#create-h1')
const updateH1Btn = document.querySelector('#update-h1')
const deleteH1Btn = document.querySelector('#delete-h1')

const createH1 = () => sendHttpRequest('POST', 'h1', '.alt-h1')
const updateH1 = () => sendHttpRequest('PUT', 'h1', '.alt-h1')
const deleteH1 = () => sendHttpRequest('DELETE', 'h1', '.alt-h1')

async function sendHttpRequest(httpMethod, elem, elemName, props) {
	try {
		const res = await fetch(TYPOGRAPHY_ENDPOINT, {
			method: httpMethod,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				tag: elem,
				name: elemName,
				cssProps: props,
			}),
		})
		const data = await res.json()
		if (httpMethod === 'POST') receiveHttpPost(data)
		if (httpMethod === 'PUT') receiveHttpPut(data)
		if (httpMethod === 'DELETE') receiveHttpDelete(data)
		console.log(data)
	} catch (err) {
		console.log(err)
	}
}

// createH1Btn.addEventListener('click', createH1)
// updateH1Btn.addEventListener('click', updateH1)
// deleteH1Btn.addEventListener('click', deleteH1)

const receiveHttpPost = data => {}
const receiveHttpPut = data => {}
const receiveHttpDelete = data => {}
