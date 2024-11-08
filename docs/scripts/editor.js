CodeMirror.defineSimpleMode('pureescript', {
	start: [
		{ token: 'comment',       regex: /\/\/.*/ },
		{ token: 'operator',      regex: /[-+*/^%=<>!():,.]+/i },
		{ token: [ 'stmt-control', null, 'operator', null, 'symbol', null, 'keyword' ], regex: /\b(PARAR)(\s+)(con)(\s+)([a-zÀ-ÖØ-öø-ÿ_][0-9a-zÀ-ÖØ-öø-ÿ_]*)(\s+)(si)\b/i },
		{ token: [ 'stmt-control', null, 'operator', null, 'number', null, 'keyword' ], regex: /\b(PARAR)(\s+)(con)(\s+)((?!_)(?:(?:[0-9_]+(?:[.][0-9]*)?)|(?:[.][0-9]+)))(\s+)(si)\b/i },
		{ token: [ 'stmt-control', null, 'operator', null, 'string', null, 'keyword' ], regex: /\b(PARAR)(\s+)(con)(\s+)((?:"|').*?(?:"|'))(\s+)(si)\b/i },
		{ token: [ 'stmt-control', null, 'symbol', null, null, null, 'symbol', null, 'stmt-control' ], regex: /\b(PARA)(\s+)([a-zÀ-ÖØ-öø-ÿ_][0-9a-zÀ-ÖØ-öø-ÿ_]*)(\s+)(con)(\s+)([a-zÀ-ÖØ-öø-ÿ_][a-zÀ-ÖØ-öø-ÿ_0-9]*)(\s+)(MIENTRAS)\b/i, indent: true },
		{ token: [ 'stmt-control', null, 'symbol', null, null, null, 'number', null, 'stmt-control' ], regex: /\b(PARA)(\s+)([a-zÀ-ÖØ-öø-ÿ_][0-9a-zÀ-ÖØ-öø-ÿ_]*)(\s+)(con)(\s+)((?!_)(?:(?:[0-9_]+(?:[.][0-9]*)?)|(?:[.][0-9]+)))(\s+)(MIENTRAS)\b/i, indent: true },
		{ token: [ 'stmt-control', null, 'symbol', null, null, null, 'string', null, 'stmt-control' ], regex: /\b(PARA)(\s+)([a-zÀ-ÖØ-öø-ÿ_][0-9a-zÀ-ÖØ-öø-ÿ_]*)(\s+)(con)(\s+)((?:"|').*?(?:"|'))(\s+)(MIENTRAS)\b/i, indent: true },
		{ token: 'stmt-control',  regex: /\bPARA\s+CADA\b/i, indent: true },
		{ token: ['stmt-control', null, 'symbol', null, 'keyword', null, 'symbol', null, 'keyword' ], regex: /\b(PARA)(\s+)([a-zÀ-ÖØ-öø-ÿ_][0-9a-zÀ-ÖØ-öø-ÿ_]*)(\s+)(desde)(\s+)([a-zÀ-ÖØ-öø-ÿ_][a-zÀ-ÖØ-öø-ÿ_0-9]*)(\s+)(hasta)\b/i, indent: true },
		{ token: ['stmt-control', null, 'symbol', null, 'keyword', null, 'number', null, 'keyword' ], regex: /\b(PARA)(\s+)([a-zÀ-ÖØ-öø-ÿ_][0-9a-zÀ-ÖØ-öø-ÿ_]*)(\s+)(desde)(\s+)((?!_)(?:(?:[0-9_]+(?:[.][0-9]*)?)|(?:[.][0-9]+)))(\s+)(hasta)\b/i, indent: true },
		{ token: ['stmt-control', null, 'symbol', null, 'keyword', null, 'string', null, 'keyword' ], regex: /\b(PARA)(\s+)([a-zÀ-ÖØ-öø-ÿ_][0-9a-zÀ-ÖØ-öø-ÿ_]*)(\s+)(desde)(\s+)((?:"|').*?(?:"|'))(\s+)(hasta)\b/i, indent: true },
		{ token: 'stmt-general',  regex: /\b(BORRAR|CARGAR|COMENTAR|CREAR|DEVOLVER|DIVIDIR|EJECUTAR|USAR|ENVIAR|DECIR|EXTENDER|GUARDAR|LEER|MULTIPLICAR|PARAR|RESTAR|SUMAR|TERMINAR)\b/i },
		{ token: 'stmt-control',  regex: /\b(BLOQUE|HACER|MIENTRAS|PARA|SI|REPETIR)\b/i, indent: true },
		{ token: 'stmt-control',  regex: /\b(SINO)\b/i, indent: true, dedent: true },
		{ token: 'stmt-control2', regex: /\b(FIN|HASTA)\b/i, dedent: true },
		{ token: 'keyword',       regex: /\b(con|en|desde|opcional|veces)\b/i },
		{ token: 'type',          regex: /\b(Número|Numero|Texto|Lógico|Logico|Lista|Registro|Marco)\b/i },
		{ token: [ 'function', 'operator', 'type' ], regex: /\b([a-zÀ-ÖØ-öø-ÿ_][0-9a-zÀ-ÖØ-öø-ÿ_]*)(\s+con\s+)(Función|Funcion)/i, indent: true },
		{ token: 'type',          regex: /\b(Función|Funcion)\b/, indent: true },
		{ token: 'atom',          regex: /\b(Verdadero|Falso|Nada)\b/i },
		{ token: 'operator',      regex: /(es|no|precede|excede|y|o)/i },
		{ token: [ null, 'function', null, 'operator'], regex: /(\b)([a-zÀ-ÖØ-öø-ÿ_][0-9a-zÀ-ÖØ-öø-ÿ_]*)(\s*)(\()/i },
		{ token: 'symbol',        regex: /\b[a-zÀ-ÖØ-öø-ÿ_][0-9a-zÀ-ÖØ-öø-ÿ_]*\b/i },
		{ token: 'number',        regex: /^(?!_)(([0-9_]+([.][0-9]*)?)|([.][0-9]+))/ },
		{ token: 'string',        regex: /\'/, next: 'stringSQ' },
		{ token: 'string',        regex: /\"/, next: 'stringDQ' },
	],
	stringSQ: [
		{ token: 'string', regex: /\'/, next: 'start' },
		{ token: 'string2', regex: /\\[nt\\'\"]/ig },
		{ token: 'error', regex: /\\[^nt\\'\"]/ig },
		{ token: 'string', regex: /[^'\\]+/ },
	],
	stringDQ: [
		{ token: 'string', regex: /\"/, next: 'start' },
		{ token: 'string2', regex: /\\[nt\\'\"]/ig },
		{ token: 'error', regex: /\\[^nt\\'\"]/ig },
		{ token: 'string', regex: /[^"\\]+/ },
	],
	meta: {
		dontIndentStates: ["comment"],
		lineComment: "//",
		electricInput: /\b(SINO|HASTA|FIN)\b/i,
	},
});

const editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
	lineNumbers: true,
	mode: 'pureescript',
	theme: 'psdocs',
	indentWithTabs: true,
	electricChars: true,
	scrollbarStyle: 'overlay',
	tabSize: 2,
});

function gotoPSDocs() {
	window.open('https://papitaconpure.github.io/ps-docs/', '_blank');
}

async function exportPS() {
	const puréscript = editor.getDoc().getValue().trim();
	const defaultFilename = 'script.tuber';

	if(window.showSaveFilePicker) {
		const handle = await window.showSaveFilePicker({
			suggestedName: 'script.tuber',
			types: [{
				id: 'psexport',
				description: 'Archivo PuréScript',
				accept: { 'text/plain': [ '.tuber' ] }
			}]
		});
		
		let writableStream;
		try {
			writableStream = await handle.createWritable();
			await writableStream.write(puréscript);
		} finally {
			await writableStream?.close();
		}
	} else {
		//Compatibilidad
		let filename = prompt('Ingresa el nombre del archivo');
		if(!filename) filename = defaultFilename;
		if(!filename.endsWith('.tuber'))
			filename += '.tuber';

		const blob = new Blob([puréscript], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}
}

function executePS() {
	const puréscript = editor.getDoc().getValue().trim();
	const outputArea = document.getElementById('output');
	outputArea.value = `PuréScript:\n\n${puréscript}`;
}
