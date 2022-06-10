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
		if (activeCM) {
			activeCM.classList.remove('active')
			activeCM.style.top = ''
			activeCM.style.left = ''
		}
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

export class VariantContextMenu extends CustomSelectorContextMenu {
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