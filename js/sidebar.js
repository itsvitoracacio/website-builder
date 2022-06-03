class Accordion {
	constructor(location, content, elementType) {
		this._accordToggle = document.querySelector(
			`.${location}${content}${elementType}Toggle`
		)
	}
	get accordToggle() {
		return this._accordToggle
	}
	openOrClose() {
		// 'this' is referring to the accordToggle
		if (this.classList.contains('open')) {
			this.classList.remove('open')
			this.parentElement.classList.remove('open')
			this.classList.add('closed')
			this.parentElement.classList.add('closed')
		} else {
			this.classList.remove('closed')
			this.parentElement.classList.remove('closed')
			this.classList.add('open')
			this.parentElement.classList.add('open')
		}
	}
}

// Edit > Sidebar toggles
const branding = new Accordion('editSidebar', 'Branding', 'List')
const elements = new Accordion('editSidebar', 'Elements', 'List')
const components = new Accordion('editSidebar', 'Components', 'List')
branding.accordToggle.addEventListener('click', branding.openOrClose)
elements.accordToggle.addEventListener('click', elements.openOrClose)
components.accordToggle.addEventListener('click', components.openOrClose)

// Edit > Working area toggles
const inheritance = new Accordion('editWorkingArea', 'Inherited', 'Rules')
const sideEffects = new Accordion('editWorkingArea', 'SideEffects', 'Rules')
inheritance.accordToggle.addEventListener('click', inheritance.openOrClose)
sideEffects.accordToggle.addEventListener('click', sideEffects.openOrClose)
