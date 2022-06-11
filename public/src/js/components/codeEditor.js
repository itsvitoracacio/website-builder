import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { css } from '@codemirror/lang-css'

export const codeEditor = new EditorView({
	state: EditorState.create({
		extensions: [
			basicSetup,
			css(),
			EditorView.updateListener.of(v => {
				if (v.docChanged) {
					console.log('DO SOMETHING WITH THE NEW CODE')
					checkForValidCode()
				}
			}),
		],
		doc: '',
	}),
	parent: document.querySelector('#codeEditorArea'),
	// viewport: { from: 1, to: 24 },
	// visibleRanges: { from: 1, to: 24 },
})
