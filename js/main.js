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
	// This is an in-between class and it shouldn't be instantiated. It is used strictly to abstract the common components (properties and methods) out of its two child classes.

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
		this.addEventListenerToRenderContent()
		this.addSelectorBtnToDom(whereOnTheDom)

		if (this.btn.dataset.context) this.addEventListenerForTheContextMenu()
	}

	setUpSelectorBtn() {
		console.log('Please set up setUpSelectorBtn() on the child class')
	}

	addSelectorBtnToDom() {
		console.log('Please set up addSelectorBtnToDom() on the child class')
	}

	addEventListenerForTheContextMenu() {
		const contextMenu = new VariantContextMenu(
			this.pieceType,
			this.endpoint,
			this.parentName,
			this.variantName
		)

		contextMenu.createContextMenu()

		const boundOpenContextMenu = contextMenu.openContextMenu.bind(contextMenu)
		this.btn.addEventListener('contextmenu', boundOpenContextMenu)
	}

	showContent() {
		console.log('Please set up showContent() on the child class')
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
		this.btn.dataset.selectorName = this.variantName

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
		const domVariantsNames = domVariants.map(dv => dv.dataset.selectorName)

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

class ContextMenu {
	constructor(pieceType, endpoint, parentName, selectorName) {
		this.pieceType = pieceType
		this.endpoint = endpoint
		this.parentName = parentName
		this.selectorName = selectorName
		this.clickEvent = ''
		this.contextMenu = document.createElement('div')
	}

	set setClickEvent(clickEvent) {
		this.clickEvent = clickEvent
	}

	createContextMenu() {
		console.log('Please define setUpContextMenu() on the child class')
	}

	openContextMenu(event) {
		// Preventing the browser from opening the default window context menu
		event.preventDefault()

		// If there's no context menu attached to the click target, do nothing
		const contextClicked = event.target.dataset.context
		if (!contextClicked) return

		// Setting the this.clickEvent property now that a click event happened
		this.setClickEvent = event

		// Setting up the actions inside the context menu and the possibility of closing it
		this.setUpContextMenuBtns()
		this.detectClickWhileContextMenuIsOpen()

		// Showing the context menu to the user
		this.showContextMenu()
	}

	setUpContextMenuBtns() {
		console.log('Please set up setUpContextMenuBtns() on the child class')
	}

	detectClickWhileContextMenuIsOpen() {
		const boundCloseContextMenu = this.closeContextMenu.bind(this)
		document.addEventListener('click', boundCloseContextMenu)
	}

	closeContextMenu() {
		// Selecting all context menus on the page
		const contextMenus = Array.from(document.querySelectorAll('.context-menu'))

		// Determining which one is active, and closing it
		const activeCM = contextMenus.find(cm => cm.classList.contains('active'))
		if (activeCM) activeCM.classList.remove('active')

		// Preventing the function from running while there's no context menu open
		document.removeEventListener('click', this.closeContextMenu)
	}

	showContextMenu() {
		this.closeContextMenu()

		this.contextMenu.classList.add('active')
		this.contextMenu.style.top = this.clickEvent.pageY + 'px'
		this.contextMenu.style.left = this.clickEvent.pageX + 'px'
	}
}

class CustomSelectorContextMenu extends ContextMenu {
	constructor(pieceType, endpoint, parentName, selectorName) {
		super(pieceType, endpoint, parentName, selectorName)
	}

	// Methods from the prototype that need to be modified
	createContextMenu() {
		this.contextMenu.id = 'contextMenuCustomSelector'
		this.contextMenu.classList.add('context-menu')
		this.contextMenu.dataset.customSelector = this.selectorName

		const menuList = document.createElement('ul')

		const deleteOption = document.createElement('li')
		deleteOption.id = 'delete-selector'
		deleteOption.classList.add('delete')
		deleteOption.innerText = 'Delete'

		const contextMenusArea = document.querySelector('.context-menus')

		menuList.appendChild(deleteOption)
		this.contextMenu.appendChild(menuList)
		contextMenusArea.appendChild(this.contextMenu)
	}

	setUpContextMenuBtns() {
		// Delete button
		this.includeDeleteSelectorBtn()
	}

	// Methods of its own
	includeDeleteSelectorBtn() {
		console.log('Please set up includeDeleteSelectorBtn() on the child class')

		// This needs to be declared on the child classes because of the .bind() method, but on both child classes it will have the exact following code:

		// // const boundCheckBeforeDeleting = this.checkBeforeDeleting.bind(this)
		// // const deleteSelectorBtn = this.contextMenu.querySelector('#delete-selector')
		// // deleteSelectorBtn.addEventListener('click', boundCheckBeforeDeleting)
	}

	// Methods needed for includeDeleteSelectorBtn()
	checkBeforeDeleting() {
		console.log('Please set up checkBeforeDeleting() on the child class')

		this.deleteCustomSelector()
	}

	async deleteCustomSelector() {
		const deleteResponse = await this.sendDeleteRequest()
		const selectorToDelete = this.determineSelectorToDelete(deleteResponse)

		this.removeSelectorContent()
		this.stopShowingSelectorAnywhereElse()
		selectorToDelete.remove() /* removing from the dom */
	}

	async sendDeleteRequest() {
		try {
			const res = await fetch(this.endpoint, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					variantName: `${this.selectorName}`,
				}),
			})
			const data = await res.json()
			return data
		} catch (err) {
			console.log(err)
		}
	}

	determineSelectorToDelete(remainingVariantsInDb) {
		// Comparing the current dom selectors to the current db selectors. The one missing should be removed
		const selectorArea = document.querySelector(`#${this.siblingsArea}Area`)
		const query = '[data-context=CustomSelector]'

		const domSelectors = Array.from(selectorArea.querySelectorAll(query))
		const domSNames = domSelectors.map(domS => domS.dataset.selectorName)

		// Determining which dom selector needs to be removed from the variants area
		const nameOfSelectorDeletedFromDb = domSNames.find(
			domSName => !(domSName in remainingVariantsInDb)
		)

		const selectorToDelete = domSelectors.find(
			domS => domS.dataset.selectorName === nameOfSelectorDeletedFromDb
		)

		return selectorToDelete
	}

	stopShowingSelectorAnywhereElse() {
		console.log(
			'Please set up stopShowingSelectorAnywhereElse() on the child class'
		)
	}

	removeSelectorContent() {
		console.log('Please set up removeSelectorContent() on the child class')
	}
}

class VariantContextMenu extends CustomSelectorContextMenu {
	constructor(pieceType, endpoint, parentName, selectorName) {
		super(pieceType, endpoint, parentName, selectorName)
		this.siblingsArea = 'variants'
	}

	// Methods from the prototype that need to be modified
	includeDeleteSelectorBtn() {
		const boundCheckBeforeDeleting = this.checkBeforeDeleting.bind(this)
		const deleteSelectorBtn = this.contextMenu.querySelector('#delete-selector')

		deleteSelectorBtn.addEventListener('click', boundCheckBeforeDeleting)
	}

	checkBeforeDeleting() {
		// The first variant selector should only be deleted if it's the only one remaining
		const isTheFirstVariantSelector = this.parentName === this.selectorName

		const variantBtns = Array.from(document.querySelectorAll('.variantBtn'))
		const isTheOnlyOneRemaining = variantBtns.length === 1

		// To demonstrate the bug, remove the bang(!) below
		if (isTheFirstVariantSelector && !isTheOnlyOneRemaining) {
			console.log("The first variant is only deleted if it's the only one")
			return
		}

		this.deleteCustomSelector()
	}

	stopShowingSelectorAnywhereElse() {
		// Both of these methods have a checker inside them to see if they need to run
		this.changeColorOfParentSelectorToNoVariants()
		this.removeFromLabelsArea()
	}

	removeSelectorContent() {
		console.log('Please set up removeSelectorContent()')
	}

	// Methods needed for this.stopShowingSelectorAnywhereElse()
	changeColorOfParentSelectorToNoVariants() {
		const variantsArea = document.querySelector('#variantsArea')
		const variantBtns = Array.from(variantsArea.querySelectorAll('button'))

		const noVariantsAnymore = variantBtns.length <= 1
		if (!noVariantsAnymore) return

		const query = `#${this.parentName}ParentSelector`
		const parentSelector = document.querySelector(query)
		parentSelector.classList.remove('hasSomeVariant')
	}

	removeFromLabelsArea() {
		const selectorFullName = this.clickEvent.target.innerText

		const variantLabelsArea = document.querySelector('#variantLabelsArea')
		const vLabels = Array.from(variantLabelsArea.children)
		const vlNames = vLabels.map(vl => vl.innerText)

		const labelIsShowing = vlNames.find(name => name === selectorFullName)

		if (!labelIsShowing) return

		const labelToDelete = vLabels.find(l => l.innerText === labelIsShowing)
		labelToDelete.remove()
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
