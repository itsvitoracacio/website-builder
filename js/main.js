class EditPieceType {
	constructor(pieceType) {
		this._pieceType = pieceType
		this._endpoint = `/api/pieces/elements/${this.pieceType.toLowerCase()}`
		this._btn = document.querySelector(`#editGet${this.pieceType}Btn`)
		this._contentLevel = 'parents'
		this._contentArea = document.querySelector(`#${this.contentLevel}Line`)
	}
	get pieceType() {
		return this._pieceType
	}
	get endpoint() {
		return this._endpoint
	}
	get btn() {
		return this._btn
	}
	get contentLevel() {
		return this._contentLevel
	}
	get contentArea() {
		return this._contentArea
	}

	async sendGetRequest() {
		try {
			const res = await fetch(this.endpoint, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			})
			const data = await res.json()
			return data
		} catch (err) {
			console.log(err)
		}
	}

	addEventListenerToRenderContent() {
		const boundRenderContent = this.renderContent.bind(this)
		this.btn.addEventListener('click', boundRenderContent)
	}

	// Change name of this method
	renderContent() {
		this.showUserWhereTheyAre()
		this.cleanContentArea()
		this.showContent()
	}

	showUserWhereTheyAre() {
		this.btn.classList.add('current-place')
	}

	cleanContentArea() {
		const contentArea = document.querySelector(`#${this.contentLevel}Line`)
		while (contentArea.lastChild) {
			contentArea.removeChild(contentArea.lastChild)
		}
	}

	async showContent() {
		document.querySelector('#editWorkingAreaH1').innerText = this.pieceType
		const allParentsOfType = await this.sendGetRequest()
		for (let parent in allParentsOfType) {
			const selector = new EditSelector(this.pieceType, 'variants', parent)
			selector.setBtn()
			selector.markSelectorIfCustomized(allParentsOfType[parent])
			selector.addSelectorBtnToDom(this.contentArea)
			selector.addEventListenerToRenderContent()
		}
	}
}

class EditSelector extends EditPieceType {
	constructor(pieceType, contentLevel, selector) {
		super(pieceType)
		this._endpoint = `/api/pieces/elements/${this.pieceType.toLowerCase()}/${selector}`
		this._btn = document.createElement('button')
		this._contentLevel = contentLevel
		this._contentArea = document.querySelector(`#${contentLevel}Line`)
		this._selector = selector
	}
	get selector() {
		return this._selector
	}
	// get endpoint() {
	// 	return this._endpoint
	// }
	// get btn() {
	// 	return this._btn
	// }
	get contentArea() {
		return this._contentArea
	}

	// Function from the prototype that will be modified
	async renderContent() {
		this.makeVariantsLineVisible()
		console.log(this)
		const allParentsOfType = await this.sendGetRequest()
		console.log(allParentsOfType)
		this.addNewVariantBtn()
	}

	setBtn() {
		this.btn.classList.add('tag-btn')
		this.btn.innerText = `<${this.selector}>`
	}
	markSelectorIfCustomized(selectorObj) {
		const selectorIsCustomized = Object.keys(selectorObj).length
		if (selectorIsCustomized) this.btn.classList.add('isStyled')
	}
	addSelectorBtnToDom(parentContentArea) {
		parentContentArea.appendChild(this.btn)
	}

	// Functions needed for renderVariants()
	makeVariantsLineVisible() {
		this.contentArea.classList.remove('hidden')
	}
	addNewVariantBtn() {
		const addVariantBtn = document.createElement('button')
		addVariantBtn.classList.add('add-variation-btn')
		addVariantBtn.innerText = '+'
		this.contentArea.appendChild(addVariantBtn)
	}
}

const typographyType = new EditPieceType('Typography')
typographyType.addEventListenerToRenderContent()

// const createH1Btn = document.querySelector('#create-h1')
// const updateH1Btn = document.querySelector('#update-h1')
// const deleteH1Btn = document.querySelector('#delete-h1')

// const showTagVariants = event => {
// 	const el = event.target.dataset.tag
// 	sendGetRequestVariants(el)
// }

// const renderVariants = variants => {

// 	for (let variant in variants) {
// 		const variantBtn = document.createElement('button')
// 		variantBtn.classList.add('variation-btn')
// 		// variantBtn.id = ''
// 		console.log(variant)
// 		if (variant === 'h1') variantBtn.innerText = `<${variant}>`
// 		else variantBtn.innerText = `<h1> .${variant}`
// 		parent.appendChild(variantBtn)
// 	}

// }

// async function sendGetRequestVariants(tag) {
// 	const endpoint = TYPOGRAPHY_ENDPOINT
// 	try {
// 		const res = await fetch(endpoint, {
// 			method: 'GET',
// 			headers: { 'Content-Type': 'application/json' },
// 		})
// 		const data = await res.json()
// 		renderVariants(data[tag])
// 	} catch (err) {
// 		console.log(err)
// 	}
// }

// const createH1 = () => sendOtherHttpRequest('POST', 'h1', '.alt-h1')
// const updateH1 = () => sendOtherHttpRequest('PUT', 'h1', '.alt-h1')
// const deleteH1 = () => sendOtherHttpRequest('DELETE', 'h1', '.alt-h1')

// async function sendOtherHttpRequest(httpMethod, elem, elemName, props) {
// 	try {
// 		const res = await fetch(TYPOGRAPHY_ENDPOINT, {
// 			method: httpMethod,
// 			headers: { 'Content-Type': 'application/json' },
// 			body: JSON.stringify({
// 				tag: elem,
// 				name: elemName,
// 				cssProps: props,
// 			}),
// 		})
// 		const data = await res.json()
// 		if (httpMethod === 'POST') receiveHttpPost(data)
// 		if (httpMethod === 'PUT') receiveHttpPut(data)
// 		if (httpMethod === 'DELETE') receiveHttpDelete(data)
// 		console.log(data)
// 	} catch (err) {
// 		console.log(err)
// 	}
// }

// // createH1Btn.addEventListener('click', createH1)
// // updateH1Btn.addEventListener('click', updateH1)
// // deleteH1Btn.addEventListener('click', deleteH1)

// const receiveHttpPost = data => {}
// const receiveHttpPut = data => {}
// const receiveHttpDelete = data => {}
