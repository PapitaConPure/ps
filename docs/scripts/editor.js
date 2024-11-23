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
		{ token: 'operator',      regex: /\b(es|no|precede|excede|y|o)\b/i },
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
		dontIndentStates: ['comment'],
		lineComment: "//",
		electricInput: /\b(SINO|HASTA|FIN)\b/i,
	},
});

const keywords = [
	//Sentencias
	'BORRAR', 'CARGAR', 'COMENTAR', 'CREAR', 'DEVOLVER', 'DIVIDIR', 'EJECUTAR', 'ENVIAR', 'EXTENDER', 'GUARDAR', 'LEER', 'MULTIPLICAR', 'PARAR', 'RESTAR', 'SUMAR', 'TERMINAR',
	'BLOQUE', 'FIN', 'HACER', 'HASTA', 'MIENTRAS', 'PARA', 'PARA CADA', 'REPETIR', 'SI', 'SINO',

	//Indicadores de Tipo
	'Número', 'Texto', 'Lógico', 'Lista', 'Registro', 'Marco', 'Función',

	//Keywords
	'Verdadero', 'Falso', 'Nada',
].map(keyword => ({
	bias: (/**@type {number}*/start) => /**@type {number}*/(start === 0 ? -4 : +2),
	value: keyword,
}));

const nativeVariableNames = (() => {
	/**@param {Function} fn*/
	const getFunctionArgs = (fn) => {
		const fnStr = fn.toString();
		let result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(/\[(.*?)\]/);

		if(result == null || result[1] == null)
			return '';

		result = result[1];

		return result.split(/\s*?,\s*?/g).join(', ');
	};
	
	const scope = new PuréScript.Scope();
	PuréScript.declareNatives(scope);

    const variableNames = /**@type {Set<{ bias: (start: number) => number, value: string }>}*/(new Set());
	for(const [ name, variable ] of scope.variables) {
		let finalName;
		if(variable.kind === 'NativeFunction' || variable.kind === 'Function')
			finalName = `${name}(${getFunctionArgs(variable.call)})`;
		else
			finalName = name;

		variableNames.add({ bias: _ => 0, value: finalName });
	}

	return variableNames;
})();

function getDeclaredVariables(editor) {
    const cursor = editor.getCursor();
    const token = editor.getTokenAt(cursor);
    const lines = /**@type {string}*/(editor.getValue()).split('\n').slice(0, cursor.line + 1);
	lines[lines.length - 1] = lines[lines.length - 1].slice(0, token.start);
	const content = lines.join('\n');
    const variables = /**@type {Set<{ bias: (start: number) => number, value: string }>}*/(new Set());

	const matches = content.matchAll(/\b(?:(?:CREAR\s+?[a-zÀ-ÖØ-öø-ÿ_]+?\s+?)|(?:CARGAR\s+?)|(?:LEER\s+?[a-zÀ-ÖØ-öø-ÿ_]+?\s+?(?:opcional\s+?)?))([a-zÀ-ÖØ-öø-ÿ_]+)/gi);
	for(const match of matches) {
		variables.add({ bias: _ => -1, value: match[1] });
	}

    return variables;
}

CodeMirror.registerHelper('hint', 'pureescript', function (editor) {
    const cursor = editor.getCursor();
    const token = editor.getTokenAt(cursor);
    const start = token.start;
    const end = token.end;
    const currentWord = /**@type {string}*/(token.string).trim();

	if(!currentWord.length) return {
		list: (start === 0 ? keywords : [ ...nativeVariableNames, ...getDeclaredVariables(editor) ]).map(h => h.value),
		from: CodeMirror.Pos(cursor.line, cursor.ch),
		to: CodeMirror.Pos(cursor.line, cursor.ch),
	};

	const hints = [ ...new Set([
		...keywords,
		...nativeVariableNames,
		...getDeclaredVariables(editor),
	])];

    const list = hints
		.map(hint => {
			const pos = hint.value.toLowerCase().indexOf(currentWord.toLowerCase());
			const lengthDiffBias = (hint.value.length - currentWord.length) * 0.25;
			const result = {
				distance: pos >= 0 ? (pos + lengthDiffBias + hint.bias(start)) : 9999,
				hint: hint.value,
			};
			
			return result;
		})
		.filter(hint => hint.distance < 8)
		.sort((a, b) => a.distance - b.distance)
		.map(hint => hint.hint);

    return {
        list,
        from: CodeMirror.Pos(cursor.line, start),
        to: CodeMirror.Pos(cursor.line, end),
    };
});

const editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
	lineNumbers: true,
	mode: 'pureescript',
	theme: 'psdocs',
	indentWithTabs: true,
	electricChars: true,
	scrollbarStyle: 'overlay',
	tabSize: 2,
	styleActiveLine: {
		nonEmpty: true,
	},
	extraKeys: {
		'Ctrl-Space': 'autocomplete',
	},
	hintOptions: {
		hint: CodeMirror.hint.pureescript,
	},
	screenReaderLabel: 'Editor de código PuréScript',
});

editor.on('inputRead', function (cm, change) {
    if(change.text[0] && /\w/.test(change.text[0])) {
        cm.showHint({ completeSingle: false });
    }
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
		if(filename == null) return;

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

const {
	lexer,
	parser,
	interpreter,
	Scope,
	EnvironmentProvider,
	declareNatives,
	declareContext,
	PSGuild,
	PSUser,
	stringifyPSAST,
	coerceValue,
} = PuréScript;

/**@implements {EnvironmentProvider}*/
class BrowserEnvironmentProvider {
	constructor() {
		this.guild = new PSGuild({
			id: '123456789012345678',
			name: 'Servidor de Prueba',
			ownerId: '123456789012345684',
			description: 'Este ser un servidor que realmente no existe',
			systemChannelId: '123456789012345680',
			iconUrlHandler: this.#testUrlHandler,
			bannerUrlHandler: this.#testUrlHandler,
			splashUrlHandler: this.#testUrlHandler,
			premiumTier: 0,
			channels:  [
				{
					id: '123456789012345680',
					name: 'canal-de-prueba-2',
					nsfw: false,
				},
			],
			roles: [
				{
					id: '123456789012345681',
					name: 'Rol de Prueba 1',
					iconUrlHandler: (data) => 'https://i.imgur.com/ALNMRS6.png',
					color: 0x608cf3,
				},
				{
					id: '123456789012345682',
					name: 'Rol de Prueba 2',
					iconUrlHandler: (data) => null,
				},
			],
			members: [
				{
					user: new PSUser({
						id: '123456789012345683',
						username: 'usuario.de.prueba',
						displayName: 'Usuario de Prueba',
					}),
					displayAvatarUrlHandler: (data) => 'https://i.imgur.com/P9eeVWC.png',
					roleIds: [ '123456789012345682' ],
				},
				{
					user: new PSUser({
						id: '123456789012345684',
						username: 'otro.usuario',
						displayName: 'Otro Usuario',
					}),
					nickname: 'Otro Usuario',
					displayAvatarUrlHandler: (data) => 'https://i.imgur.com/P9eeVWC.png',
					roleIds: [],
				},
			]
		});

		this.channel = this.guild.registerChannel({
			id: '123456789012345679',
			name: 'canal-de-prueba-1',
			nsfw: false,
		});

		this.user = new PSUser({
			id: '651250669390528561',
			username: 'botdepure',
		});

		this.member = this.guild.registerMember({
			user: this.user,
			nickname: 'Bot de Puré',
			displayAvatarUrlHandler: (data) => 'https://i.imgur.com/P9eeVWC.png',
			roleIds: [ '123456789012345681', '123456789012345682' ],
		});
	}
	
	getGuild() {
		return this.guild;
	}

	getChannel() {
		return this.channel;
	}

	getUser() {
		return this.user;
	}

	getMember() {
		return this.member;
	}

	/**@param {string} query*/
	fetchChannel(query) {
		if(!isNaN(+query)) {
			const channel = this.guild.channels.get(query);
			if(channel) return channel;
		}

		let bestScore = 0;
		let bestMatch = null;

		for(const channel of this.guild.channels.values()) {
			if(channel.name.includes(query) && channel.name.length > bestScore) {
				bestScore = channel.name.length;
				bestMatch = channel;
			}
		}

		return bestMatch;
	}

	/**@param {string} query*/
	fetchRole(query) {
		if(!isNaN(+query)) {
			const role = this.guild.roles.get(query);
			if(role) return role;
		}

		let bestScore = 0;
		let bestMatch = null;

		for(const roles of this.guild.roles.values()) {
			if(roles.name.includes(query) && roles.name.length > bestScore) {
				bestScore = roles.name.length;
				bestMatch = roles;
			}
		}

		return bestMatch;
	}

	/**@param {string} query*/
	fetchMember(query) {
		if(!isNaN(+query)) {
			const member = this.guild.members.get(query);
			if(member) return member;
		}

		let bestScore = 0;
		let bestMatch = null;

		for(const member of this.guild.members.values()) {
			const tryName = (/**@type {string?}*/ name) => {
				if(name && name.includes(query) && name.length > bestScore) {
					bestScore = name.length;
					bestMatch = member;
					return true;
				}
				return false;
			}

			if(tryName(member.nickname)) continue;
			if(tryName(member.user.displayName)) continue;
			if(tryName(member.user.username)) continue;
		}

		return bestMatch;
	}

	/**
	 * @param {import('../src/interpreter/environment/environmentProvider').ImageUrlOptions} data 
	 */
	#testUrlHandler(data) {
		return '';
	}
}

/**
 * @param {string} str 
 */
function sanitizeHtml(str) {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

/**
 * @param {string} content 
 */
function markup(content) {
	const PART_CODE_BLOCK = '<<<PART/CODE/BLOCK>>>';
	const PART_CODE_INLINE = '<<<PART/CODE/INLINE>>>';

	const parts = [];

	return sanitizeHtml(content)
		//Pre-procesado a formatos sin formato interno
		.replace(/```([a-z0-9]{0,4})?\n((?:.|\n)+?)```/gi, (_, lang, code) => {
			code = code.replace(/\n/g, '<br>');
			parts.push({ lang, code });
			return PART_CODE_BLOCK;
		})
		.replace(/\`([^`]+)\`/g, (_, code) => {
			code = code.replace(/\n/g, '<br>');
			parts.push({ code });
			return PART_CODE_INLINE;
		})
		//Formatos de línea
        .replace(/^([\t ]*?)([-*]|(?:[0-9]+\.)) (.+)$/gm, (_, tabsOrSpaces, mark, item) => {
			const tag = (mark === '*' || mark === '-') ? 'ul' : 'ol';
			const order = tag === 'ul' ? '•' : mark;
			const prefix = tabsOrSpaces.replace(/  /g, '\t');
			const level = prefix.length;
			return (level ? `<span class="list-indent" style="width:${0.5 * level}rem"></span>` : '')
				 + `<span class="list-order" style="width:${tag === 'ul' ? 0.5 : 1}rem">${order}</span>`
				 + `<${tag}">${item}</${tag}>`;
		})
        .replace(/^( +?)\* (.+)/gm, '<li>$1</li>')
		.replace(/^### (.+)/gm, '<h3>$1</h3>')
		.replace(/^## (.+)/gm, '<h2>$1</h2>')
		.replace(/^# (.+)/gm, '<h1>$1</h1>')
		.replace(/^-# (.+)/gm, '<div class="disclaimer">$1</div>')
		.replace(/^&gt; (.+)/gm, '<div class="quote">$1</div>')
		//Eliminar breaks sobrantes
		.replace(/\n ?<([a-z0-9])/gi, '<$1')
		.replace(/([a-z0-9])> ?\n/gi, '$1>')
		//Formatos comunes
		.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
		.replace(/\*([^*]+)\*/g, '<i>$1</i>')
		.replace(/__([^_]+)__/g, '<span class="underline">$1</span>')
		.replace(/_([^_]+)_/g, '<i>$1</i>')
		.replace(/~~([^~]+)~~/g, '<span class="line-through">$1</span>')
		.replace(/\|\|([^\|]+)\|\|/g, '<span class="spoiler">$1</span>')
		//Otros
		.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
		.replaceAll(PART_CODE_BLOCK, () => `<code class="block w-full">${parts.shift().code}</code>`)
		.replaceAll(PART_CODE_INLINE, () => `<code>${parts.shift().code}</code>`)
		.replace(/\n/g, '<br>');
}

/**
 * @param {Array<String>} args 
 * @returns {Array<String>}
 */
function groupQuoted(args) {
	const result = [];

	let isInsideQuotes = false;
	let groupedTemp = [];

	for(let arg of args) {
		if(arg.startsWith('"') && !isInsideQuotes) {
			isInsideQuotes = true;
			groupedTemp.push(arg.slice(1));
		} else if(arg.endsWith('"') && isInsideQuotes && !arg.endsWith('\\"')) {
			groupedTemp.push(arg.slice(0, -1));
			result.push(groupedTemp.join(' ').trim());
			groupedTemp = [];
			isInsideQuotes = false;
		} else if(isInsideQuotes)
			groupedTemp.push(arg);
		else
			result.push(arg);
	}

	if(isInsideQuotes)
		result.push(groupedTemp.join(' '));

	return result;
}

/**
 * @param {MessageKind} kind
 */
function createSendButton(kind) {
	const sendBtn = document.createElement('button');
	const sendIcon = document.createElement('i');
	sendIcon.classList.add('fa', 'fa-paper-plane');
	sendBtn.ariaLabel = 'Volver a ejecutar orden';
	sendBtn.appendChild(sendIcon);
	return sendBtn;
}

let savedData = new Map();
let messagesToAppend = [];
let busyOutput = false;
let lastInput = null;
setInterval(function() {
	if(!busyOutput) return;

	const appendMessage = messagesToAppend.shift();
	if(!appendMessage) {
		busyOutput = false;
		return;
	}

	appendMessage();
}, 80);

const MessageKinds = /**@const*/({
	text: { className: 'message-text', icon: 'fa-comment' },
	embed: { className: 'message-embed', icon: null },
	error: { className: 'message-error', icon: 'fa-circle-exclamation' },
	return: { className: 'message-return', icon: 'fa-share-from-square' },
	input: { className: 'message-input', icon: 'fa-keyboard' },
});
/**@typedef {keyof MessageKinds} MessageKind*/

function initOutput(isTestDrive) {
	const outputCont = document.getElementById('output');

	if(!outputCont) {
		console.warn('No output container was found (#output)');
		return {
			success: /**@const @type {false}*/(false),
			outputCont: null,
			sendMessage: () => {},
		};
	}
	
	if(isTestDrive) {
		messagesToAppend = [];
		outputCont.innerHTML = '';
		savedData =  new Map();
		lastInput = null;
	}

	/**
	 * @param {{ kind: MessageKind, data: * }} options 
	 */
	function sendMessage(options) {
		const { kind, data } = options;

		const message = document.createElement('div');
		message.classList.add('message', MessageKinds[kind].className);

		if(kind === 'embed') {
			const { author, color, url, title, description, fields, imageUrl, thumbUrl, footer } = data;

			if(color) {
				if(!isNaN(color))
					message.style.borderLeftColor = `#${color.toString(16)}`;
				else if(Array.isArray(color))
					message.style.borderLeftColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
				else if(color === 'Random')
					message.style.borderLeftColor = `rgb(${
						Math.floor(Math.random() * 0x100)
					}, ${
						Math.floor(Math.random() * 0x100)
					}, ${
						Math.floor(Math.random() * 0x100)
					})`;
				else if(typeof color === 'string' && color.startsWith('#') && color.length >= 3)
					message.style.borderLeftColor = color;
			}

			if(!author && !title && !description) {
				if(thumbUrl) {
					const thumb = document.createElement('img');
					if(thumb.style.width > thumb.style.height)
						thumb.style.width = '96px';
					else
						thumb.style.height = '96px';
					thumb.style.margin = '0 0 0.25rem auto';
					thumb.src = thumbUrl;
					thumb.alt = 'Miniatura';
					thumb.loading = 'lazy';
					thumb.decoding = 'async';
					thumb.fetchPriority = 'low';
					message.appendChild(thumb);
				}
			} else {
				const embedTop = document.createElement('div');
				embedTop.classList.add('message-embed-hgroup');
				
				const hgroup = document.createElement('div');
	
				if(author) {
					const element = document.createElement(author.url ? 'a' : 'div');
					element.classList.add('message-embed-author');

					if(author.iconUrl) {;
						const icon = document.createElement('img');
						icon.src = author.iconUrl;
						icon.alt = 'Ícono de autor';
						icon.loading = 'lazy';
						icon.decoding = 'async';
						icon.fetchPriority = 'low';
						element.appendChild(icon);

						const name = document.createElement('span')
						name.textContent = author.name;
						element.appendChild(name);
					} else {
						element.textContent = author.name;
					}

					if(author.url) element.href = author.url;

					hgroup.appendChild(element);
				}
	
				if(title) {
					const element = document.createElement(url ? 'a' : 'h2');
					element.classList.add('message-embed-title');
					element.textContent = title;
					if(url) element.href = url;
					hgroup.appendChild(element);
				}
	
				if(description) {
					const element = document.createElement('p');
					element.innerHTML = markup(description);
					hgroup.appendChild(element);
				}

				embedTop.appendChild(hgroup);

				if(thumbUrl) {
					const thumb = document.createElement('img');
					if(thumb.style.width > thumb.style.height)
						thumb.style.width = '96px';
					else
						thumb.style.height = '96px';
					thumb.style.margin = '0 0 0.25rem 0.25rem';
					thumb.src = thumbUrl;
					thumb.alt = 'Miniatura';
					thumb.loading = 'lazy';
					thumb.decoding = 'async';
					thumb.fetchPriority = 'low';
					embedTop.appendChild(thumb);
				}

				message.appendChild(embedTop);
			}

			if(fields) {
				const table = document.createElement('table');

				const rows = [];
				let row = { names: [], values: [] };
				rows.push(row.names, row.values);

				for(const field of fields) {
					if(!field.inline && row.names.length !== 0) {
						row = { names: [], values: [] };
						rows.push(row.names, row.values);
					}

					row.names.push(field.name);
					row.values.push(field.value);
					
					if(!field.inline || row.names.length === 3) {
						row = { names: [], values: [] };
						rows.push(row.names, row.values);
					}
				}

				for(let i = 0; i < rows.length; i++) {
					const rowElement = document.createElement('tr');

					for(const data of rows[i]) {
						const cell = document.createElement((i % 2 === 0) ? 'th' : 'td');
						cell.innerHTML = markup(data);
						rowElement.appendChild(cell);
					}

					table.appendChild(rowElement);
				}

				message.appendChild(table);
			}

			if(imageUrl) {
				const element = document.createElement('img');
				element.src = imageUrl;
				element.alt = 'Imagen';
				element.loading = 'lazy';
				element.decoding = 'async';
				element.fetchPriority = 'low';
				message.appendChild(element);
			}

			if(footer) {
				const element = document.createElement('div');
				element.classList.add('message-embed-footer');
				const text = document.createElement('div');

				if(footer.iconUrl) {
					const icon = document.createElement('img');
					icon.src = footer.iconUrl;
					icon.loading = 'lazy';
					icon.decoding = 'async';
					icon.fetchPriority = 'low';
					icon.alt = 'Ícono de pie';
					element.appendChild(icon);
				}

				text.textContent = footer.text;
				element.appendChild(text);
				message.appendChild(element);
			}
		} else {
			const icon = document.createElement('i');
			icon.classList.add('message-icon', 'fa', MessageKinds[kind].icon);
			message.appendChild(icon);
			
			const content = document.createElement(kind === 'input' ? 'textarea' : 'div');
			content.style.overflowX = 'hidden';
			if(kind === 'error') {
				const errorHeader = document.createElement('h2');
				errorHeader.textContent = data.name ?? 'Error';
				
				const errorDescription = document.createElement('p');
				errorDescription.classList.add('message-content');
				errorDescription.innerHTML = data.message ? markup(data.message.replace(/\t/g, ' ')) : 'Error desconocido';

				content.appendChild(errorHeader);
				content.appendChild(errorDescription);
			} else if(data) {
				content.classList.add('message-text');
				if(kind === 'input') {
					content.innerHTML = (lastInput == null) ? sanitizeHtml(data) : '';
				} else
					content.innerHTML = markup(data);
			}
			
			message.appendChild(content);
			
			if(kind === 'input') {
				content.name = 'entradas';
				content.ariaLabel = 'Ingresa entradas de re-ejecución separadas por espacios aquí';
				lastInput = content;
				
				const sendBtn = createSendButton(kind);
				message.appendChild(sendBtn);

				/**
				 * @param {HTMLButtonElement} button 
				 * @param {HTMLTextAreaElement} argsHolder 
				 */
				async function reexecutePS(button, argsHolder) {
					const trimmedContent = argsHolder.value.replace(/^\s+|\s+$/, '');
					const args = trimmedContent.length ? groupQuoted(trimmedContent.split(/\s+/)) : [];
					const success = await executePS(args);
					argsHolder.disabled = true;
					button.disabled = true;
					button.classList.add('sent');

					if(!success) {
						const newMessage = document.createElement('div');
						newMessage.classList.add('message', MessageKinds[kind].className);
	
						const newIcon = document.createElement('i');
						newIcon.classList.add('message-icon', 'fa', MessageKinds[kind].icon);
						newMessage.appendChild(newIcon);
						const newContent = document.createElement('textarea');
						newContent.name = 'entradas';
						newContent.innerHTML = '';
						newContent.ariaLabel = 'Ingresa entradas de re-ejecución separadas por espacios aquí';
						newContent.classList.add('message-text');
						lastInput = newContent;
						newMessage.appendChild(newContent);
	
						const newSendBtn = createSendButton(kind);
						newMessage.appendChild(newSendBtn);
						messagesToAppend.push(() => {
							outputCont.appendChild(newMessage);
							if(messagesToAppend.length === 0)
								outputCont.scrollTo({ top: outputCont.scrollHeight, behavior: 'smooth' });

							if(kind === 'input')
								setTimeout(_ => newContent != null && !newContent.disabled && newContent.focus(), 320 + 80 * messagesBeforeInput);
						});
						busyOutput = true;

						newSendBtn.addEventListener('click', _ => reexecutePS(newSendBtn, newContent), { once: true, passive: true });
						newContent.addEventListener('keydown', function(e) {
							if(e.key !== 'Enter' || e.shiftKey)
								return true;
							
							reexecutePS(newSendBtn, newContent);
							return false;
						}, { passive: true });
					}
				}

				sendBtn.addEventListener('click', _ => reexecutePS(sendBtn, content), { once: true, passive: true });
				content.addEventListener('keydown', function(e) {
					if(e.key !== 'Enter' || e.shiftKey)
						return true;
					
					reexecutePS(sendBtn, content);
					return false;
				}, { passive: true });
			}
		}

		const messagesBeforeInput = messagesToAppend.length;
		messagesToAppend.push(() => {
			outputCont.appendChild(message);
			if(messagesToAppend.length === 0)
				outputCont.scrollTo({ top: outputCont.scrollHeight, behavior: 'smooth' });

			if(kind === 'input')
				setTimeout(_ => lastInput != null && !lastInput.disabled && lastInput.focus(), 320 + 80 * messagesBeforeInput);
		});
		busyOutput = true;
	}

	return {
		success: /**@const @type {true}*/(true),
		outputCont,
		sendMessage,
	};
}

function stringifyValue(value) {
	if(value.kind === 'Nada') return 'Nada';
	return coerceValue(interpreter, value, 'Text').value;
}

/**
 * @param {Array<String>} [args] 
 */
async function executePS(args = undefined) {
	const puréscript = editor.getDoc().getValue().trim();
	const isTestDrive = (args == null);

	const { success, sendMessage } = initOutput(isTestDrive);

	if(!success) {
		console.error('Output container was not properly initialized');
		return false;
	}

	try {
		const tokens = lexer.tokenize(puréscript);
		const tree = parser.parse(tokens);
		
		const scope = new Scope(interpreter);
		const provider = new BrowserEnvironmentProvider();
		declareNatives(scope);
		await declareContext(scope, provider, savedData);

		const result = interpreter.evaluateProgram(tree, scope, puréscript, provider, args, isTestDrive);
		if(!result.sendStack.length) {
			const error = new Error('No se envió ningún mensaje');
			error.name = 'TuberSendError';
			throw error;
		}

		if(!result.sendStack.length) {
			const error = new Error('Demasiados embeds');
			error.name = 'TuberSendError';
			throw error;
		}

		const contentLines = [];
		const embeds = [];
		for(const value of result.sendStack) {
			if(value.kind === 'Embed')
				embeds.push(value.value);
			else
				contentLines.push(stringifyValue(value));
		}

		const content = contentLines.join('\n').trim('');
		if(!content.length && !embeds.length) {
			const error = new Error('No se envió ningún mensaje');
			error.name = 'TuberSendError';
			throw error;
		}

		for(const [ id, value ] of result.saveTable) {
			if(value.kind === 'Nada')
				savedData.delete(id);
			else {
				function objectify(value) {
					const toSave = {
						kind: value.kind,
					};

					if(value.value != null)
						toSave.value = value.value;

					if(value.elements != null) {
						toSave.elements = value.elements.map(v => objectify(v));
					}
					
					if(value.entries != null) {
						toSave.entries = {};
						for(const [ id, v ] of value.entries)
							toSave.entries[id] = objectify(v);
					}

					return toSave;
				}
				savedData.set(id, objectify(value));
			}
		}
		
		if(contentLines) {
			sendMessage({
				kind: 'text',
				data: content,
			});
		};

		for(const embed of embeds) {
			const { author, title, description, fields, imageUrl, thumbUrl, footer } = embed.data;

			if(author || title || description || fields?.length || imageUrl || thumbUrl || footer) {
				sendMessage({
					kind: 'embed',
					data: embed.data,
				});
			} else {
				const err = new Error('Se envió un Marco vacío que fallará en Discord');
				err.name = 'TuberSendError';
				sendMessage({
					kind: 'error',
					data: err,
				});
			}
		}

		sendMessage({
			kind: 'return',
			data: stringifyValue(result.returned),
		});

		sendMessage({
			kind: 'input',
			data: result.inputStack.map((input, i) => input.spread ? `${input.name}_0 ${input.name}_1 ... ${input.name}_N` : input.name).join(' '),
		});

		return true;
	} catch(err) {
		console.error(err);

		sendMessage({
			kind: 'error',
			data: {
				name: typeof err === 'string' ? err : err.name,
				message: (err.message ?? 'Este error no ofrece información adicional'),
			},
		});

		return false;
	}
}

document.body.addEventListener('keydown', function(e) {
	if(e.key === 'F1') {
		window.onhelp = function() {
			alert();
			return false;
		}
		e.stopPropagation();
		e.preventDefault();
		gotoPSDocs();
		return false;
	}

	if(!e.ctrlKey)
		return true;

	switch(e.key) {
	case '/':
		document.getElementById('modal-backdrop').classList.toggle('hidden');
		return false;

	case 'Enter':
		executePS();
		return false;

	case 'E':
	case 'e':
		if(!e.shiftKey) return true;
		exportPS();
		return false;

	case 'H':
	case 'h':
		if(!e.shiftKey) return true;
		gotoPSDocs();
		return false;
	}
	
	return true;
}, { passive: true });

setTimeout(executePS, 200);
