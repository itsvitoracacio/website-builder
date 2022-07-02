import { ContextMenu } from '../basicUi/contextMenu/contextMenu'

class CustomSelectorContextMenu extends ContextMenu {
	constructor({ pieceType, endpoint, pieceName, selectorName, deleteMethod }) {
		super({ pieceType, endpoint })
		this.pieceName = pieceName
		this.selectorName = selectorName
		this.crudDelete = deleteMethod
	}

	// creates the context menu for a given element, with all its options and functionality
	createContextMenu() {
		// setting up this context menu
		this.contextMenu.id = 'contextMenuCustomSelector'
		this.contextMenu.classList.add('context-menu')
		this.contextMenu.dataset.customSelector = this.selectorName

		// creating the list of buttons that will be on this context menu
		const menuList = document.createElement('ul')
		this.setUpContextMenuBtns(menuList)
		this.contextMenu.appendChild(menuList)

		// adding this context menu to the dom
		const contextMenusArea = document.querySelector('.context-menus')
		contextMenusArea.appendChild(this.contextMenu)
	}

	// creates each of the buttons that this element needs in its context menu
	setUpContextMenuBtns(menuList) {
		// creating the delete selector button
		const deleteBtnOnContextMenu = document.createElement('li')
		deleteBtnOnContextMenu.id = 'delete-selector'
		deleteBtnOnContextMenu.classList.add('delete')
		deleteBtnOnContextMenu.innerText = 'Delete'

		this.addDeleteSelectorFunctionality(deleteBtnOnContextMenu)

		// menuList.appendChild(deleteOptionOnContextMenu)
	}

	// this method is only defined on the children classes because of .bind(), but on both child classes it will have the exact code
	addDeleteSelectorFunctionality() {
		console.log(
			'Please set up addDeleteSelectorFunctionality() on the child class'
		)
	}

	// this method is only defined on the children classes
	checkBeforeDeleting() {
		console.log('Please set up checkBeforeDeleting() on the child class')

		// this.deleteCustomSelector()
	}

	// holds all methods needed to delete the selector from the db and show the user that it was deleted
	async deleteCustomSelector() {
		const deleteResponse = await this.crudDelete()
		const selectorToDelete =
			this.determineSelectorToDeleteFromTheDom(deleteResponse)

		// if it's a parent selector, it removes the variant from the dom
		this.removeSelectorChildren()
		this.stopShowingSelectorAnywhereElse()
		selectorToDelete.remove() /* removing the selector itself from the dom */
	}

	// makes sure that we're only removing from the dom what was just removed from the database
	determineSelectorToDeleteFromTheDom(remainingCustomSelectorsInDb) {
		// comparing the current dom selectors to the current db selectors
		const selectorArea = document.querySelector(`#${this.siblingsArea}Area`)
		const query = '[data-context=CustomSelector]'

		const domSelectors = Array.from(selectorArea.querySelectorAll(query))
		const domSNames = domSelectors.map(domS => domS.dataset.selectorName)

		// determining the name of the selector deleted from the db
		const nameOfSelectorDeletedFromDb = domSNames.find(
			domSName => !(domSName in remainingCustomSelectorsInDb)
		)

		// storing that selector in a variable to return it
		const selectorToDelete = domSelectors.find(
			domS => domS.dataset.selectorName === nameOfSelectorDeletedFromDb
		)

		return selectorToDelete
	}

	// this method is only defined on the children classes
	stopShowingSelectorAnywhereElse() {
		console.log(
			'Please set up stopShowingSelectorAnywhereElse() on the child class'
		)
	}

	// this method is only define on the children classes
	removeSelectorChildren() {
		console.log('Please set up removeSelectorContent() on the child class')
	}
}

// still need to create methods for this class
export class PieceTypeContextMenu extends CustomSelectorContextMenu {
	constructor() {}
}

// still need to create methods for this class
export class PieceContextMenu extends CustomSelectorContextMenu {
	constructor({ pieceType, endpoint, parentName, selectorName, deleteMethod }) {
		super({ pieceType, endpoint, parentName, selectorName, deleteMethod })
		this.siblingsArea = 'parents'
	}
}

export class VariantContextMenu extends CustomSelectorContextMenu {
	constructor({ pieceType, endpoint, pieceName, selectorName, deleteMethod }) {
		super({ pieceType, endpoint, pieceName, selectorName, deleteMethod })
		this.siblingsArea = 'variants'
	}

	// adds the behavior to the ui element delete button
	addDeleteSelectorFunctionality(deleteBtnOnContextMenu) {
		// this is only defined here because of the .bind() method, but it's the same across sibling classes
		const boundCheckBeforeDeleting = this.checkBeforeDeleting.bind(this)
		deleteBtnOnContextMenu.addEventListener('click', boundCheckBeforeDeleting)
	}

	// checks whether the variant the user is trying to delete is the first variant created for that parent selector. Since it's the generic variant, that has the same name as the parent selector, it should only be deleted if it's the only one remaining
	checkBeforeDeleting() {
		const isTheFirstVariantSelector = this.parentName === this.selectorName

		const variantBtns = Array.from(document.querySelectorAll('.variantBtn'))
		const isTheOnlyOneRemaining = variantBtns.length === 1

		if (isTheFirstVariantSelector && !isTheOnlyOneRemaining) {
			console.log("The first variant is only deleted if it's the only one")
			return
		}

		this.deleteCustomSelector() /* this method comes from the parent class */
	}

	// holds all methods to remove the selector from everywhere in the ui
	stopShowingSelectorAnywhereElse() {
		// Both of these methods have a checker inside them to see if they need to run
		this.changeColorOfParentSelectorToNoVariants()
		this.removeFromLabelsArea()
	}

	// removes the css declaration block from the code editor
	removeSelectorChildren() {
		// Read what's written on the editor
		const currentValue = codeEditor.state.doc.toString()
		const endPosition = currentValue.length

		// Change what's written on the editor
		codeEditor.dispatch({
			changes: {
				from: 0,
				to: endPosition,
				insert: '',
			},
		})
	}

	// shows to the user that a parent selector has no variants
	changeColorOfParentSelectorToNoVariants() {
		// checking if we really don't have any other variants
		const variantsArea = document.querySelector('#variantsArea')
		const variantBtns = Array.from(variantsArea.querySelectorAll('button'))

		const noVariantsAnymore = variantBtns.length <= 1
		if (!noVariantsAnymore) return

		// changing the color of the parent selector
		const query = `#${this.parentName}ParentSelector`
		const parentSelector = document.querySelector(query)
		parentSelector.classList.remove('hasSomeVariant')
	}

	// shows to the user that they can no longer edit that variant if they were in the middle of doing so
	removeFromLabelsArea() {
		// checking if the label that we should remove is actually showing
		const selectorFullName = this.clickEvent.target.innerText

		const variantLabelsArea = document.querySelector('#variantLabelsArea')
		const vLabels = Array.from(variantLabelsArea.children)
		const vlNames = vLabels.map(vl => vl.innerText)

		const labelIsShowing = vlNames.find(name => name === selectorFullName)

		if (!labelIsShowing) return

		// removing the label from the labels area
		const labelToDelete = vLabels.find(l => l.innerText === labelIsShowing)
		labelToDelete.remove()
	}
}
