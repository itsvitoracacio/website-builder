import { PieceType, Piece, PieceVariant } from '../../js/editPage'

class NewSelectorBtn {
	constructor(pieceType, selectorsArea) {
		this.pieceType = pieceType
		this.endpoint = `/api/pieces/elements/${this.pieceType.toLowerCase()}`
		this.newSelectorForm = document.createElement('form')
		this.newSelectorBtn = document.createElement('input')
		this.selectorsArea = selectorsArea
	}

	setUpForm(formId = 'newPieceTypeForm') {
		this.newSelectorForm.autocomplete = 'off'
		this.newSelectorForm.id = formId
		this.addSubmitEventListenerToCreateNewSelector()
	}

	setUpBtn(btnId, btnClass) {
		this.newSelectorBtn.type = 'button'
		this.newSelectorBtn.value = '+'
		this.newSelectorBtn.id = btnId
		this.newSelectorBtn.classList.add(btnClass)
		this.newSelectorBtn.autocomplete = 'off'
	}

	setUpChangeBtnOnFocus() {}

	changeBtnToInput(inputType) {
		this.newSelectorBtn.type = inputType
		this.newSelectorBtn.value = ''
		this.newSelectorForm.focus()
		this.newSelectorBtn.focus()
		this.newSelectorBtn.select()
	}

	addSubmitEventListenerToCreateNewSelector() {
		this.newSelectorForm.addEventListener('submit', e => {
			e.preventDefault()

			const dbVariants = this.createSelector(this.newSelectorBtn.value)
			this.receivePostResponse(dbVariants)
		})
	}

	createSelector() {}

	receivePostResponse() {}

	appendBtnToForm() {
		this.newSelectorForm.appendChild(this.newSelectorBtn)
	}
}

export class NewPieceTypeBtn extends NewSelectorBtn {
	constructor() {}
}

export class NewPieceBtn extends NewSelectorBtn {
	constructor() {}
}

export class NewVariantBtn extends NewSelectorBtn {
	constructor({ pieceType, selectorsArea, pieceName, createMethod }) {
		super(pieceType, selectorsArea)
		this.pieceName = pieceName
		this.endpoint = `/api/pieces/elements/${this.pieceType.toLowerCase()}/${this.pieceName}`
		this.crudCreate = createMethod
	}

	setUpForm() {
		super.setUpForm('newVariantForm')
	}

	setUpBtn() {
		super.setUpBtn('newVariantBtn', 'add-variation-btn')
	}

	setUpChangeBtnOnFocus() {
		//
		// Turning btn into input text on click
		this.newSelectorBtn.addEventListener('focusin', () => {
			//
			// The 1st variant it is automatically created w/ the default parameter: this.parentSelector
			// If it's not the 1st, the user can choose the variant's name

			const isTheFirstVariant = !document
				.querySelector(`#${this.pieceName}ParentSelector`)
				.classList.contains('hasSomeVariant')

			if (isTheFirstVariant) this.createSelector()
			else this.changeBtnToInput()
		})

		// Turning input text back into btn on focusout
		this.newSelectorBtn.addEventListener('focusout', () => {
			this.newSelectorBtn.type = 'button'
			this.newSelectorBtn.value = '+'
		})
	}

	async createSelector(inputValue = this.pieceName) {
		return await this.createMethod({
			pieceType: this.pieceType,
			pieceName: this.pieceName,
			variantName: inputValue,
		})
	}

	receivePostResponse(dbVariants) {
		const domVariants = Array.from(document.querySelectorAll('.variantBtn'))
		const domVariantsNames = domVariants.map(dv => dv.dataset.selectorName)

		const dbVariantsNames = Object.keys(dbVariants)
		const newName = dbVariantsNames.find(dbv => !domVariantsNames.includes(dbv))

		const newVariant = new PieceVariant({
			pieceType: this.pieceType,
			childrenLevel: 'cssRules',
			pieceName: this.pieceName,
			variantName: newName,
		})

		newVariant.renderSelector(this.variantsArea)

		this.showThatThisParentSelectorNowHasVariants()
		this.newSelectorBtn.blur()
	}

	showThatThisParentSelectorNowHasVariants() {
		const parentSelectorId = `#${this.pieceName}ParentSelector`

		const parentSelector = document.querySelector(parentSelectorId)
		parentSelector.classList.add('hasSomeVariant')
	}

	changeBtnToInput() {
		super.changeBtnToInput('text')
	}
}
