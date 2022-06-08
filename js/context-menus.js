window.addEventListener('contextmenu', e => {
	e.preventDefault()

	const contextClicked = e.target.dataset.context
	if (!contextClicked) return

	const contextMenu = document.querySelector(`#contextMenu${contextClicked}`)
	contextMenu.classList.add('active')
	contextMenu.dataset.customSelector = e.target.id
	console.log(e.target.id)

	contextMenu.style.top = e.pageY + 'px'
	contextMenu.style.left = e.pageX + 'px'
})

window.addEventListener('click', () => {
	const contextMenus = Array.from(document.querySelectorAll('.context-menu'))

	const activeCM = contextMenus.find(cm => cm.classList.contains('active'))

	if (activeCM) {
		activeCM.dataset.customSelector = ''
		activeCM.classList.remove('active')
	}
})

const deleteSelectorBtn = document.querySelector('#delete-selector')
deleteSelectorBtn.addEventListener('click', deleteSelector)

function deleteSelector(e) {
	const contextMenu = e.target.parentElement.parentElement
	const cmCustomSelector = contextMenu.dataset.customSelector

	console.log(cmCustomSelector)

	// const variantSelector = document.querySelector(`#${cmCustomSelector}`)
	// console.log(variantSelector)
	// variantSelector.deleteVariant()
}
