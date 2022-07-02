import {
	PieceTypeContextMenu,
	PieceContextMenu,
	VariantContextMenu,
} from '../components/design/design_contextMenu'
import {
	NewPieceTypeBtn,
	NewPieceBtn,
	NewVariantBtn,
} from '../components/design/design_newSelectorBtn'
import {
	PieceTypeCrud,
	PieceCrud,
	VariantCrud,
} from '../components/design/design_api'
import { codeEditor } from '../components/codeEditor'

export class PieceType {
	/*

	// When the page is loaded, we create an instance of PieceType class for each piece type on the sidebar, then we add an event listener onto that piece type to render its content when clicked.

	// If the user clicks on the piece type item that show what's already being shown, we do nothing.
	// If they click on a different piece type item, we render that content to the user. To do that, we:
	
	// 1) show the user where they are now (after they clicked)
	// 2) then we clean the content area by removing anything that was previously being shown
	// 3) finally, we show the selectors belonging to that piece type (that we get from our database)

	*/

	constructor({ pieceType }) {
		this.pieceType = pieceType
		this.btn = document.querySelector(`#editGet${this.pieceType}Btn`)
		this.childrenLevel = 'parents'
		this.childrenArea = document.querySelector(`#${this.childrenLevel}Area`)
		this.endpoint = `/api/pieces/elements/${this.pieceType.toLowerCase()}`
		this.crud = new PieceTypeCrud(this.pieceType)
	}

	// adds event listener to render the children of the piece type when it's clicked on the left sidebar
	addEventListenerToRenderChildren() {
		const boundRenderSelectorChildren = this.renderChildren.bind(this)
		this.btn.addEventListener('click', boundRenderSelectorChildren)
	}

	// holds all methods needed to render the children of the piece type to the user
	renderChildren(e) {
		// checks whether the children aren't already being shown. if they are, do nothing
		const isAlreadyBeingShown = e.target.classList.contains('current-place')
		if (isAlreadyBeingShown) return

		this.showUserWhereTheyAre()
		this.cleanChildrenArea()
		this.showChildren() /* this method is different in the children classes */
	}

	// adds a color or a border to the currently active button (either a piece type btn on the sidebar or a piece selector on the main area)
	showUserWhereTheyAre() {
		const siblings = Array.from(this.btn.parentElement.children)
		siblings.forEach(sibling => sibling.classList.remove('current-place'))

		this.btn.classList.add('current-place')
	}

	// remove from the main area everything that may be there from other piece types that were previously clicked
	cleanChildrenArea(childrenAreaIdHandle = this.childrenLevel) {
		const childrenArea = document.querySelector(`#${childrenAreaIdHandle}Area`)

		while (childrenArea.lastChild) {
			childrenArea.removeChild(childrenArea.lastChild)
		}
	}

	// render the main area to the user, with the current piece type heading and all its piece selectors
	async showChildren() {
		// adding the piece type name to the heading on the main area
		document.querySelector('#editWorkingAreaH1').innerText = this.pieceType

		// getting all pieces of this type on the database
		const allPieces = await this.crud.readPiecesOfType()
		// rendering on the screen each piece that comes from the database
		for (let pName in allPieces) {
			const piece = new Piece({
				pieceType: /* { pieceType: 'Typography' } */ this.pieceType,
				childrenLevel: 'variants',
				pieceName: pName,
			})
			piece.renderSelector({
				whereOnTheDom: this.childrenArea,
				selectorObj: allPieces[pName],
			})
		}
	}
}

class Selector extends PieceType {
	/*

	// This is an in-between class and it shouldn't be instantiated. It is used strictly to abstract the common components (properties and methods) out of its two child classes.

	*/

	constructor({ pieceType, childrenLevel, pieceName }) {
		super({ pieceType })
		this.pieceType = pieceType

		this.btn = document.createElement('button')
		this.childrenLevel = childrenLevel
		this.childrenArea = document.querySelector(`#${this.childrenLevel}Area`)
		this.pieceName = pieceName
		this.endpoint = `/api/pieces/elements/${this.pieceType.toLowerCase()}/${
			this.pieceName
		}`
	}

	// holds all methods necessary to show each selector on the main area with all its functionality
	renderSelector({ whereOnTheDom }) {
		this.setUpSelectorBtn() /* this method is defined on the children classes */
		this.addEventListenerToRenderChildren() /* this method comes from the parent class */
		this.addSelectorBtnToDom(whereOnTheDom) /*defined on the children classes*/

		// checking if the selector has a context menu attached to it, and if it has, adding an an event listener to open the context menu when the user right-clicks it
		if (this.btn.dataset.context) this.addEventListenerForTheContextMenu()
	}

	// this method is only defined on the children classes
	setUpSelectorBtn() {
		console.log('Please set up setUpSelectorBtn() on the child class')
	}

	// this method is only defined on the children classes
	addSelectorBtnToDom() {
		console.log('Please set up addSelectorBtnToDom() on the child class')
	}

	// this method name comes from the parent class, but it is only defined on the children classes
	showChildren() {
		console.log('Please set up showContent() on the child class')
	}

	// holds all methods needed for the context menu to work as expected
	addEventListenerForTheContextMenu() {
		this.contextMenu.createContextMenu()
		// this.contextMenu.setUpContextMenuBtns()
		this.contextMenu.detectClickWhileContextMenuIsOpen()

		/* may actually need to bind this.contextMenu */
		const boundOpenContextMenu = this.contextMenu.openContextMenu.bind(
			this.contextMenu
		)
		this.btn.addEventListener('contextmenu', boundOpenContextMenu)
	}
}

export class Piece extends Selector {
	/*

	// When the user is on a piece type area (coming from the left sidebar), we render each piece selector of the type that they clicked.

	// If the selector has variants, we change the piece selector color to let the user know that it has variants even before clicking them.

	// And when the user clicks on one of the selectors, we:

	// 1) show the current place the user is, by adding a border to the piece selector they clicked
	// 2) add to a line just below the piece selectors line: a span that says "Variants:", and a "+" button to create new variants
	// 3) if it's the case that the piece selector clicked already has variants, we show all its variants on that new line, between the span and the "+ button"
	// 4) after the variants line has all it needs, we make it visible and also make the piece editing area visible.

	*/

	constructor({ pieceType, childrenLevel, pieceName }) {
		super({ pieceType, childrenLevel, pieceName })
		this.crud = new PieceCrud({
			pieceType: this.pieceType,
			pieceName: this.pieceName,
		})
	}

	// holds all methods necessary to show each selector on the main area with all its functionality, and mark them differently in case they have any variants
	renderSelector({ whereOnTheDom, selectorObj }) {
		super.renderSelector({ whereOnTheDom })

		this.markSelectorBtnIfItHasVariants(selectorObj)
	}

	// this method is called by super.renderSelector(whereOnTheDom)
	setUpSelectorBtn() {
		this.btn.classList.add('tag-btn')
		this.btn.id = `${this.pieceName}ParentSelector`
		this.btn.innerText = `<${this.pieceName}>`
	}

	// this method is called by super.renderSelector(whereOnTheDom)
	addSelectorBtnToDom(whereOnTheDom) {
		whereOnTheDom.appendChild(this.btn)
	}

	// removes all variant selectors from the variant selectors line and all the variant labels (see PieceVariant class) from the variant labels area. it is called by super.renderChildren(), only when the user clicks on a piece selector that's different from the one that's currently showing
	cleanChildrenArea() {
		super.cleanChildrenArea() /* this one gets called with the default parameter = this.childrenLevel */
		super.cleanChildrenArea('variantLabels')
		// We may need to clean more areas here
	}

	// holds all methods needed for showing the variant selectors on the variant selectors line
	async showChildren() {
		this.createVariantLineSpan()
		this.createNewVariantBtn()

		const allVariants = await this.crud.readVariantsOfPiece()

		for (let vName in allVariants) {
			const variant = new PieceVariant({
				pieceType: this.pieceType,
				childrenLevel: 'codeEditor',
				pieceName: this.pieceName,
				variantName: vName,
			})

			variant.renderSelector({ whereOnTheDom: this.childrenArea })
		}

		this.makeVariantsLineVisible()
		this.makeEditingAreaVisible()
	}

	// Method needed for this.renderSelector()
	markSelectorBtnIfItHasVariants(selectorObj) {
		const selectorIsCustomized = Object.keys(selectorObj).length
		if (selectorIsCustomized) this.btn.classList.add('hasSomeVariant')
	}

	// adds the "Variant:" span to the variants line. this is called by this.showChildren()
	createVariantLineSpan() {
		const variantsLineName = document.createElement('span')
		variantsLineName.innerText = 'Variants:'

		this.childrenArea.appendChild(variantsLineName)
	}

	// adds the "+" button to the variants line
	createNewVariantBtn() {
		const newVariantBtn = new NewVariantBtn({
			pieceType: this.pieceType,
			selectorsArea: this.childrenArea,
			pieceName: this.pieceName,
			createMethod: newVariantName => {
				this.crud.createVariant(newVariantName)
			},
		})

		newVariantBtn.setUpForm()
		newVariantBtn.setUpBtn()
		newVariantBtn.setUpChangeBtnOnFocus()
		newVariantBtn.appendBtnToForm()

		this.childrenArea.appendChild(newVariantBtn.newSelectorForm)
	}

	// this is called by this.showChildren()
	makeVariantsLineVisible() {
		this.childrenArea.classList.remove('hidden')
	}

	// this is called by this.showChildren()
	makeEditingAreaVisible() {
		const editingArea = document.querySelector('#editingArea')
		editingArea.classList.remove('hidden')
	}
}

export class PieceVariant extends Selector {
	constructor({ pieceType, childrenLevel, pieceName, variantName }) {
		super({ pieceType, childrenLevel, pieceName })

		this.variantName = variantName
		this.crud = new VariantCrud({
			pieceType: this.pieceType,
			pieceName: this.pieceName,
		})
		this.contextMenu = new VariantContextMenu({
			pieceType: this.pieceType,
			endpoint: this.endpoint,
			pieceName: this.pieceName,
			selectorName: this.variantName,
			deleteMethod: () => {
				this.crud.deleteVariant(this.variantName)
			},
		})
	}

	// removes what's written on the code editor. this is called by super.renderChildren(e)
	cleanChildrenArea() {
		// read what's written on the editor
		const currentValue = codeEditor.state.doc.toString()
		const endPosition = currentValue.length

		// change what's written on the editor to an empty string
		codeEditor.dispatch({
			changes: {
				from: 0,
				to: endPosition,
				insert: '',
			},
		})
	}

	// this is called by super.renderSelector({ whereOnTheDom })
	setUpSelectorBtn() {
		this.btn.classList.add('variation-btn')
		this.btn.id = `${this.variantName}VariantSelector`
		this.btn.classList.add('variantBtn')
		this.btn.dataset.context = 'CustomSelector'
		this.btn.dataset.selectorName = this.variantName

		this.btn.innerText =
			this.variantName === this.pieceName
				? (this.btn.innerText = `<${this.pieceName}>`)
				: (this.btn.innerText = `<${this.pieceName}> .${this.variantName}`)
	}

	// adds the variant selector button to the variant selector line, right before the "+" button. this is called by super.renderSelector({ whereOnTheDom })
	addSelectorBtnToDom(whereOnTheDom) {
		const newVariantForm = document.querySelector('#newVariantForm')
		whereOnTheDom.insertBefore(this.btn, newVariantForm)
		// create variantRequests instance of specificHttpReqs
		// add click event listener to enter this variant (showUserWhereTheyAre, cleanChildrenArea, renderCssRules)
	}

	async showChildren() {
		// instead of returning all variants, this method below needs to return the css declaration block for a specific variant
		const declarationBlock = await this.crud.readDeclarationBlockOfVariant(
			this.variantName
		)

		const cssDeclarations = declarationBlock.length
			? declarationBlock
					.map(d => `${Object.keys(d)}: ${d[Object.keys(d)]};`)
					.join('\n\t')
			: ''
		const cssRule = `${this.variantName} {\n\t${cssDeclarations}\n}\n`

		// get what's written on the editor
		const currentValue = codeEditor.state.doc.toString()
		const endPosition = currentValue.length

		// change what's written on the editor to the cssDeclaration of the clicked variant
		codeEditor.dispatch({
			changes: {
				from: 0,
				to: endPosition,
				insert: cssRule,
			},
		})
	}

	showUserWhereTheyAre() {
		// removing the 'current-place' class from other selector btns
		const selectorsBtns = Array.from(this.btn.parentElement.children)
		selectorsBtns.forEach(btn => btn.classList.remove('current-place'))

		// Removing the other labels label from the DOM
		const variantLabelsArea = document.querySelector('#variantLabelsArea')
		const visibleLabels = Array.from(variantLabelsArea.children)
		if (visibleLabels) visibleLabels.forEach(label => label.remove())

		// Adding the 'current-place' class to this selector button
		this.btn.classList.add('current-place')

		// Creating and setting up the label for this selector button
		const variantLabel = document.createElement('span')
		variantLabel.classList.add('variation-label')
		variantLabel.innerText = this.btn.innerText

		// Adding the event listener to remove the lable and the css rule block from the code editor
		variantLabel.addEventListener('click', e => {
			e.target.remove() /* Removes the label from the label area */
			this.cleanChildrenArea() /* Removes the css rule block from the content editor */

			this.btn.classList.remove('current-place') /* Removes class from btn */
		})

		// Adding the label to the DOM
		variantLabelsArea.appendChild(variantLabel)
	}
}
