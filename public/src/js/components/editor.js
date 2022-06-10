import { EditorState } from '@codemirror/state'
import {
	drawSelection,
	dropCursor,
	EditorView,
	highlightActiveLine,
	highlightActiveLineGutter,
	highlightSpecialChars,
	keymap,
	lineNumbers,
	rectangularSelection,
} from '@codemirror/view'
import { defaultKeymap, history } from '@codemirror/commands'
import {
	bracketMatching,
	foldGutter,
	indentOnInput,
} from '@codemirror/language'
import { css } from '@codemirror/lang-css'
import { autocompletion, closeBrackets } from '@codemirror/autocomplete'

const startState = EditorState.create({
	doc: 'Hello World',
	extensions: [
		// Language
		foldGutter(),
		indentOnInput(),
		bracketMatching(),
		// Langs
		css(),
		// View
		lineNumbers(),
		highlightSpecialChars(),
		drawSelection(),
		dropCursor(),
		rectangularSelection(),
		highlightActiveLine(),
		highlightActiveLineGutter(),
		// Commands
		keymap.of(defaultKeymap),
		history(),
		// Autocompletion
		autocompletion(),
		closeBrackets(),
	],
})

const editorParent = document.querySelector('#codeEditorArea')

export const codeEditor = new EditorView({
	state: startState,
	parent: editorParent,
})
