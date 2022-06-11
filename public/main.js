import { Accordion } from './src/js/components/accordion'
import { EditPieceType } from './src/js/editPage'

// Edit > Sidebar toggles
const branding = new Accordion('editSidebar', 'Branding', 'List')
const elements = new Accordion('editSidebar', 'Elements', 'List')
const components = new Accordion('editSidebar', 'Components', 'List')
branding.accordToggle.addEventListener('click', branding.openOrClose)
elements.accordToggle.addEventListener('click', elements.openOrClose)
components.accordToggle.addEventListener('click', components.openOrClose)

// Edit > Sidebar toggles > Elements
const typographyType = new EditPieceType('Typography')
typographyType.addEventListenerToRenderContent()

// Edit > Working area > Code editor


// Edit > Working area toggles
const inheritance = new Accordion('editWorkingArea', 'Inherited', 'Rules')
const sideEffects = new Accordion('editWorkingArea', 'SideEffects', 'Rules')
inheritance.accordToggle.addEventListener('click', inheritance.openOrClose)
sideEffects.accordToggle.addEventListener('click', sideEffects.openOrClose)
