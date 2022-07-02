export class Accordion {
	constructor(location, content, elementType) {
		this.accordToggle = document.querySelector(
			`.${location}${content}${elementType}Toggle`
		)
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