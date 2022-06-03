class Accordion {
	constructor(content, elementType, location) {
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

const branding = new Accordion('Branding', 'List', 'editSidebar')
const elements = new Accordion('Elements', 'List', 'editSidebar')
const components = new Accordion('Components', 'List', 'editSidebar')
branding.accordToggle.addEventListener('click', branding.openOrClose)
elements.accordToggle.addEventListener('click', elements.openOrClose)
components.accordToggle.addEventListener('click', components.openOrClose)
