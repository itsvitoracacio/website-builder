class EditPieceType {
	//
	// When the page is loaded, we create an instance of this EditPieceType class for each piece type on the sidebar, then we add an event listener to render its content when it's clicked.

	// When one of these buttons are clicked, if it leads to a different section, we need to render that content to the user. So first we show the user where they are now, then we clean any content that's currently where we will place new content, and finally we show the parent selectors belonging to that piece type.

	// But in order to show the parent selectors on the screen, we first need to get them on our database through a get request to our server.

	constructor(pieceType) {
		this.pieceType = pieceType
		this.endpoint = `/api/pieces/elements/${this.pieceType.toLowerCase()}`
		this.btn = document.querySelector(`#editGet${this.pieceType}Btn`)
		this.childrenLevel = 'parents'
		this.childrenArea = document.querySelector(`#${this.childrenLevel}Area`)
	}

	addEventListenerToRenderContent() {
		const boundRenderContent = this.renderContent.bind(this)
		this.btn.addEventListener('click', boundRenderContent)
	}

	renderContent(e) {
		const isAlreadyBeingShown = e.target.classList.contains('current-place')
		if (isAlreadyBeingShown) return

		this.showUserWhereTheyAre()
		this.cleanChildrenArea()
		this.showContent()
	}

	showUserWhereTheyAre() {
		const siblings = Array.from(this.btn.parentElement.children)
		siblings.forEach(sibling => sibling.classList.remove('current-place'))

		this.btn.classList.add('current-place')
	}

	cleanChildrenArea(childrenAreaIdHandle = this.childrenLevel) {
		const childrenArea = document.querySelector(`#${childrenAreaIdHandle}Area`)

		while (childrenArea.lastChild) {
			childrenArea.removeChild(childrenArea.lastChild)
		}
	}

	async showContent() {
		document.querySelector('#editWorkingAreaH1').innerText = this.pieceType

		const allParents = await this.sendGetRequest()

		for (let parentName in allParents) {
			const parentSelector = new EditParentSelector(
				this.pieceType,
				'variants',
				parentName
			)

			parentSelector.renderSelector(this.childrenArea, allParents[parentName])
		}
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
}

class EditSelector extends EditPieceType {
	//
	// This is an in-between class and it shouldn't be instantiated. It is used to set the standards for how its 2 child classes should be structured and abstract their common components out of them.

	constructor(pieceType, childrenLevel, parentName) {
		super(pieceType)

		this.endpoint = `/api/pieces/elements/${this.pieceType.toLowerCase()}/${parentName}`
		this.btn = document.createElement('button')
		this.childrenLevel = childrenLevel
		this.childrenArea = document.querySelector(`#${childrenLevel}Area`)
		this.parentName = parentName
	}

	renderSelector(whereOnTheDom) {
		this.setUpSelectorBtn()
		this.addEventListenerForTheContextMenu()
		this.addEventListenerToRenderContent()
		this.addSelectorBtnToDom(whereOnTheDom)
	}

	setUpSelectorBtn() {
		console.log('Please set up setUpSelectorBtn() on the child class')
	}

	addSelectorBtnToDom() {
		console.log('Please set up addSelectorBtnToDom() on the child class')
	}

	showContent() {
		console.log('Please set up showContent() on the child class')
	}

	addEventListenerForTheContextMenu() {
		const boundOpenContextMenu = this.openContextMenu.bind(this)
		this.btn.addEventListener('contextmenu', boundOpenContextMenu)
	}

	openContextMenu(e) {
		e.preventDefault()

		const contextClicked = e.target.dataset.context
		if (!contextClicked) return

		const contextMenu = document.querySelector(`#contextMenu${contextClicked}`)
		contextMenu.classList.add('active')
		contextMenu.style.top = e.pageY + 'px'
		contextMenu.style.left = e.pageX + 'px'

		this.setUpContextMenuBtns()
	}

	setUpContextMenuBtns() {
		// Delete button
		const deleteSelectorBtn = document.querySelector('#delete-selector')
		const boundDeleteCustomSelector = this.deleteCustomSelector.bind(this)
		deleteSelectorBtn.addEventListener('click', boundDeleteCustomSelector)
	}

	async deleteCustomSelector() {
		const deleteResponse = await this.sendDeleteRequest()
		this.receiveDeleteResponse(deleteResponse)
	}

	async sendDeleteRequest() {
		try {
			const res = await fetch(this.endpoint, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					variantName: `${this.variantName}`,
				}),
			})
			const data = await res.json()
			return data
		} catch (err) {
			console.log(err)
		}
	}

	receiveDeleteResponse(remainingVariantsInDb) {
		// This needs to be updated when it's time to add the feature of deleting custom selectors at the parent level
		const selectorArea = document.querySelector(`#${'variants'}Area`)
		const domVariants = Array.from(
			selectorArea.querySelectorAll(`[data-context=CustomSelector]`)
		)

		const deletedFromDb = domVariants.find(
			variant => !(variant in Object.keys(remainingVariantsInDb))
		)

		console.log(deletedFromDb)
		deletedFromDb.remove()

		// there is some bugs, like sometimes it deletes the wrong button and sometimes it deletes 2 btns
		// need to make the context menu disappear after a click inside or outside it (check ig saved post)
		// need to stop trying to add the remove method in a event listener when there's no more btns
		// need to delete children
		// need to delete from show user where they are
	}
}

class EditParentSelector extends EditSelector {
	//
	// When the page is loaded, we create an instance of this EditPieceType class for each piece type on the sidebar, then we add an event listener to render its content when it's clicked.

	// When one of these buttons are clicked, if it leads to a different section, we need to render that content to the user. So first we show the user where they are now, then we clean any content that's currently where we will place new content, and finally we show the parent selectors belonging to that piece type.

	// But in order to show the parent selectors on the screen, we first need to get them on our database through a get request to our server.

	constructor(pieceType, childrenLevel, parentName) {
		super(pieceType, childrenLevel, parentName)
	}

	// Methods from the prototype that will be modified
	renderSelector(whereOnTheDom, selectorObj) {
		super.renderSelector(whereOnTheDom)

		this.markSelectorBtnIfCustomized(selectorObj)
	}

	setUpSelectorBtn() {
		this.btn.classList.add('tag-btn')
		this.btn.id = `${this.parentName}ParentSelector`
		this.btn.innerText = `<${this.parentName}>`
	}

	addSelectorBtnToDom(whereOnTheDom) {
		whereOnTheDom.appendChild(this.btn)
	}

	cleanChildrenArea() {
		super.cleanChildrenArea() /* this one gets called with the default parameter = this.childrenLevel */
		super.cleanChildrenArea('variantLabels')
		// We may need to clean more areas here
	}

	async showContent() {
		this.createVariantLineSpan()
		this.createAddNewVariantBtn()

		const allVariants = await this.sendGetRequest()

		for (let variantName in allVariants) {
			const variantSelector = new EditVariantSelector(
				this.pieceType,
				'cssRules',
				this.parentName,
				variantName
			)

			variantSelector.renderSelector(this.childrenArea)
		}

		this.makeVariantsLineVisible()
		this.makeEditingAreaVisible()
	}

	// Method needed for this.renderSelector()
	markSelectorBtnIfCustomized(selectorObj) {
		const selectorIsCustomized = Object.keys(selectorObj).length
		if (selectorIsCustomized) this.btn.classList.add('hasSomeVariant')
	}

	// Methods needed for this.showContent()
	createVariantLineSpan() {
		const variantsLineName = document.createElement('span')
		variantsLineName.innerText = 'Variants:'

		this.childrenArea.appendChild(variantsLineName)
	}

	createAddNewVariantBtn() {
		const addNewVariant = new EditAddVariantBtn(
			this.pieceType,
			this.endpoint,
			this.parentName,
			this.childrenArea
		)

		addNewVariant.setUpForm()
		addNewVariant.setUpBtn()
		addNewVariant.setUpChangeBtnOnFocus()
		addNewVariant.appendBtnToForm()

		this.childrenArea.appendChild(addNewVariant.newVariantForm)
	}

	makeVariantsLineVisible() {
		this.childrenArea.classList.remove('hidden')
	}

	makeEditingAreaVisible() {
		const editingArea = document.querySelector('#editingArea')
		editingArea.classList.remove('hidden')
	}
}

class EditVariantSelector extends EditSelector {
	constructor(pieceType, childrenLevel, parentName, variantName) {
		super(pieceType, childrenLevel, parentName)

		this.variantName = variantName
	}

	setUpSelectorBtn() {
		this.btn.classList.add('variation-btn')
		this.btn.id = `${this.variantName}VariantSelector`
		this.btn.classList.add('variantBtn')
		this.btn.dataset.context = 'CustomSelector'
		this.btn.dataset.variantName = this.variantName

		this.btn.innerText =
			this.variantName === this.parentName
				? (this.btn.innerText = `<${this.parentName}>`)
				: (this.btn.innerText = `<${this.parentName}> .${this.variantName}`)
	}

	addSelectorBtnToDom(whereOnTheDom) {
		const newVariantForm = document.querySelector('#newVariantForm')
		whereOnTheDom.insertBefore(this.btn, newVariantForm)
		// create variantRequests instance of specificHttpReqs
		// add click event listener to enter this variant (showUserWhereTheyAre, cleanChildrenArea, renderCssRules)
	}

	async showContent() {
		console.log(
			'Please set up the showContent() method for the variant selectors'
		)
	}

	showUserWhereTheyAre() {
		this.btn.classList.add('current-place')

		const variantLabel = document.createElement('span')
		variantLabel.classList.add('variation-label')
		variantLabel.innerText = this.btn.innerText

		variantLabel.addEventListener('click', e => {
			e.target.remove()

			this.btn.classList.remove('current-place')
		})

		const variantLabelsArea = document.querySelector('#variantLabelsArea')
		variantLabelsArea.appendChild(variantLabel)
	}
}

class EditAddVariantBtn {
	constructor(pieceType, endpoint, parentName, variantsArea) {
		this.pieceType = pieceType
		this.endpoint = endpoint
		this.parentName = parentName
		this.newVariantForm = document.createElement('form')
		this.newVariantBtn = document.createElement('input')
		this.variantsArea = variantsArea
	}

	setUpForm() {
		this.newVariantForm.autocomplete = 'off'
		this.newVariantForm.id = 'newVariantForm'
		this.addSubmitEventListenerToAddNewVariant()
	}

	setUpBtn() {
		this.newVariantBtn.type = 'button'
		this.newVariantBtn.value = '+'
		this.newVariantBtn.id = 'newVariantBtn'
		this.newVariantBtn.classList.add('add-variation-btn')
		this.newVariantBtn.autocomplete = 'off'
	}

	setUpChangeBtnOnFocus() {
		//
		// Turning btn into input text on click
		this.newVariantBtn.addEventListener('focusin', () => {
			//
			// The 1st variant it is automatically created w/ the default parameter: this.parentSelector
			// If it's not the 1st, the user can choose the variant's name

			const isTheFirstVariant = !document
				.querySelector(`#${this.parentName}ParentSelector`)
				.classList.contains('hasSomeVariant')

			if (isTheFirstVariant) this.createVariant()
			else this.changeBtnToInput()
		})

		// Turning input text back into btn on focusout
		this.newVariantBtn.addEventListener('focusout', () => {
			this.newVariantBtn.type = 'button'
			this.newVariantBtn.value = '+'
		})
	}

	changeBtnToInput() {
		this.newVariantBtn.type = 'text'
		this.newVariantBtn.value = ''
		this.newVariantForm.focus()
		this.newVariantBtn.focus()
		this.newVariantBtn.select()
	}

	addSubmitEventListenerToAddNewVariant() {
		this.newVariantForm.addEventListener('submit', e => {
			e.preventDefault()

			this.createVariant(this.newVariantBtn.value)
		})
	}

	async createVariant(inputValue = this.parentName) {
		try {
			const res = await fetch(this.endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					pieceType: this.pieceType,
					parentName: this.parentName,
					variantName: inputValue,
				}),
			})
			const dbVariants = await res.json()
			this.receivePostResponse(dbVariants)
		} catch (err) {
			console.log(err)
		}
	}

	receivePostResponse(dbVariants) {
		const domVariants = Array.from(document.querySelectorAll('.variantBtn'))
		const domVariantsNames = domVariants.map(dv => dv.dataset.variantName)

		const dbVariantsNames = Object.keys(dbVariants)
		const newName = dbVariantsNames.find(dbv => !domVariantsNames.includes(dbv))

		const newVariant = new EditVariantSelector(
			this.pieceType,
			'cssRules',
			this.parentName,
			newName
		)

		newVariant.renderSelector(this.variantsArea)

		this.showThatThisParentSelectorNowHasVariants()
		this.newVariantBtn.blur()
	}

	showThatThisParentSelectorNowHasVariants() {
		const parentSelectorId = `#${this.parentName}ParentSelector`

		const parentSelector = document.querySelector(parentSelectorId)
		parentSelector.classList.add('hasSomeVariant')
	}

	appendBtnToForm() {
		this.newVariantForm.appendChild(this.newVariantBtn)
	}
}

const typographyType = new EditPieceType('Typography')
typographyType.addEventListenerToRenderContent()

// Not sure if we need these classes below
class HttpReqs {
	constructor() {}
	async sendGetRequest(whereToGetIt) {
		await this.sendHttpRequest('GET', whereToGetIt)
	}

	async sendPostRequest(whereToPostIt, whatToPost) {
		console.log('sending post request')
		await this.sendHttpRequest('POST', whereToPostIt, whatToPost)
	}

	async sendPutRequest(whereToUpdateIt, whatToUpdate) {
		await this.sendHttpRequest('PUT', whereToUpdateIt, whatToUpdate)
	}

	async sendDeleteRequest(whereToDeleteItFrom, whatToDelete) {
		await this.sendHttpRequest('POST', whereToDeleteItFrom, whatToDelete)
	}

	async sendHttpRequest(httpMethod, endpoint, reqBody) {
		try {
			const res = await fetch(
				endpoint,
				httpMethod === 'GET'
					? {
							method: 'GET',
							headers: { 'Content-Type': 'application/json' },
					  }
					: {
							method: httpMethod,
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify(reqBody),
					  }
			)
			const data = await res.json()
			console.log(data)
			return data
			// if (httpMethod === 'POST') receiveHttpPost(data)
			// if (httpMethod === 'PUT') receiveHttpPut(data)
			// if (httpMethod === 'DELETE') receiveHttpDelete(data)
		} catch (err) {
			console.log(err)
		}
	}
}

class EditTypeHttpReqs extends HttpReqs {
	constructor(pieceType, endpoint) {
		super()
		this.pieceType = pieceType
		this.endpoint = endpoint
	}
	getTypeSelectors() {
		this.sendGetRequest(this.endpoint)
	}
}

class EditVariantHttpReqs extends HttpReqs {
	constructor(pieceType, selector, endpoint) {
		super()
		this.pieceType = pieceType
		this.selector = selector
		this.endpoint = endpoint
	}
	createVariant(variantName) {
		const pieceType = this.pieceType
		const selector = this.selector
		this.sendPutRequest({ pieceType, selector, variantName }, this.endpoint)
	}
	readVariantRules(variantName) {}
}
