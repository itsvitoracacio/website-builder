export class ContextMenu {
	constructor({ pieceType, endpoint }) {
		this.pieceType = pieceType
		this.endpoint = endpoint
		this.clickEvent = ''
		this.contextMenu = document.createElement('div')
	}

	set setClickEvent(clickEvent) {
		this.clickEvent = clickEvent
	}

	// this method is only defined on the children classes
	createContextMenu() {
		console.log('Please define createContextMenu() on the child class')
	}

	// holds everything that needs to get done prior to showing the context menu when a user right-clicks
	openContextMenu(event) {
		// preventing the browser from opening its default context menu
		event.preventDefault()

		// if there's no context menu attached to the click target, do nothing
		const contextClicked = event.target.dataset.context
		if (!contextClicked) return

		// setting the this.clickEvent property now that a click event happened
		this.setClickEvent = event

		// closing other context menu that might be open and then showing the correct one for what the user clicked
		this.closeContextMenu()
		this.showContextMenu()
	}

	// this method is only defined on the children classes
	setUpContextMenuBtns() {
		console.log('Please set up setUpContextMenuBtns() on the child class')
	}

	// triggers the closing of any context menu when the user clicks anywhere while one is open
	detectClickWhileContextMenuIsOpen() {
		const boundCloseContextMenu = this.closeContextMenu.bind(this)
		document.addEventListener('click', boundCloseContextMenu)
	}

	// closes any context menu that might be open on the page
	closeContextMenu() {
		// selecting all context menus on the page, regardless of element
		const contextMenus = Array.from(document.querySelectorAll('.context-menu'))

		// determining which one is active, and closing it
		const activeCM = contextMenus.find(cm => cm.classList.contains('active'))
		if (activeCM) {
			activeCM.classList.remove('active')
			activeCM.style.top = ''
			activeCM.style.left = ''
		}
	}

	// shows the context menu of the element that the user clicked and positions it correctly
	showContextMenu() {
		this.contextMenu.classList.add('active')
		this.contextMenu.style.top = this.clickEvent.pageY + 'px'
		this.contextMenu.style.left = this.clickEvent.pageX + 'px'
	}
}
