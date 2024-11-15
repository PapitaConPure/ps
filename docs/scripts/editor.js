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

function stringifyValue(value) {
	if(value.kind === 'Nada') return 'Nada';
	return coerceValue(interpreter, value, 'Text').value;
}

const MessageKinds = /**@const*/({
	text: { className: 'message-text', icon: 'fa-comment' },
	embed: { className: 'message-embed', icon: null },
	error: { className: 'message-error', icon: 'fa-circle-exclamation' },
	return: { className: 'message-return', icon: 'fa-share-from-square' },
	input: { className: 'message-input', icon: 'fa-keyboard' },
});
/**@typedef {keyof MessageKinds} MessageKind*/

/**
 * @param {string} content 
 */
function markup(content) {
	return content
		.replace(/```([a-z0-9]{0,4}\n)?((?:.|\n)+?)```/gi, '<code class="block w-full">$2</code>')
		.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
		.replace(/\*([^*]+)\*/g, '<i>$1</i>')
		.replace(/__([^_]+)__/g, '<span class="underline">$1</span>')
		.replace(/_([^_]+)_/g, '<i>$1</i>')
		.replace(/~~([^_]+)~~/g, '<span class="line-through">$1</span>')
		.replace(/\`([^`]+)\`/g, '<code>$1</code>')
		.replace(/\|\|([^\|]+)\|\|/g, '<span class="spoiler">$1</span>')
		.replace(/^### (.+)\n?/gm, '<h3>$1</h3>')
		.replace(/^## (.+)\n?/gm, '<h2>$1</h2>')
		.replace(/^# (.+)\n?/gm, '<h1>$1</h1>')
		.replace(/^-# (.+)\n?/gm, '<div class="disclaimer">$1</div>')
		.replace(/\[(.+?)\]\((.+?)\)/, '<a href="$2">$1</a>')
		.replace(/\n/g, '<br>');
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

					row.names.push(markup(field.name));
					row.values.push(markup(field.value));
					
					if(!field.inline || row.names.length === 3) {
						row = { names: [], values: [] };
						rows.push(row.names, row.values);
					}
				}

				for(let i = 0; i < rows.length; i++) {
					const rowElement = document.createElement('tr');

					for(const data of rows[i]) {
						const cell = document.createElement((i % 2 === 0) ? 'th' : 'td');
						cell.innerHTML = data;
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
				message.appendChild(element);
			}

			if(footer) {
				const element = document.createElement('div');
				element.classList.add('message-embed-footer');
				element.textContent = footer.text;
				message.appendChild(element);
			}
		} else {
			const icon = document.createElement('i');
			icon.classList.add('message-icon', 'fa', MessageKinds[kind].icon);
			message.appendChild(icon);
			
			const content = document.createElement(kind === 'input' ? 'textarea' : 'div');
			if(kind === 'error') {
				const errorHeader = document.createElement('h2');
				errorHeader.textContent = data.name ?? 'Error';
				
				const errorDescription = document.createElement('p');
				errorDescription.classList.add('message-content');
				errorDescription.style.width = '96%';
				errorDescription.innerHTML = data.message ? markup(data.message.replace(/\t/g, ' ')) : 'Error desconocido';

				content.appendChild(errorHeader);
				content.appendChild(errorDescription);
			} else {
				content.classList.add('message-text');
				if(kind === 'input') {
					content.innerHTML = (lastInput == null) ? data : '';
					lastInput = content;
				} else
					content.innerHTML = markup(data);
			}
			
			message.appendChild(content);
			
			if(kind === 'input') {
				const sendBtn = document.createElement('button');
				const sendIcon = document.createElement('i');
				sendIcon.classList.add('fa', 'fa-paper-plane');
				sendBtn.appendChild(sendIcon);
				message.appendChild(sendBtn);

				/**
				 * @param {HTMLButtonElement} button 
				 * @param {HTMLTextAreaElement} argsHolder 
				 */
				async function reexecutePS(button, argsHolder) {
					const args = argsHolder.value.length ? argsHolder?.value.split(/\s+/) : [];
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
						newMessage.appendChild(newContent);
	
						const newSendBtn = document.createElement('button');
						const newSendIcon = document.createElement('i');
						newSendIcon.classList.add('fa', 'fa-paper-plane');
						newSendBtn.appendChild(newSendIcon);
						newMessage.appendChild(newSendBtn);
						messagesToAppend.push(() => {
							outputCont.appendChild(newMessage);
							if(messagesToAppend.length === 0)
								outputCont.scrollTo({ top: outputCont.scrollHeight, behavior: 'smooth' });
						});
						busyOutput = true;
						newSendBtn.addEventListener('click', _ => reexecutePS(newSendBtn, newContent), { once: true });
					}
				}

				sendBtn.addEventListener('click', _ => reexecutePS(sendBtn, content), { once: true });
			}
		}

		const messagesBeforeInput = messagesToAppend.length;
		messagesToAppend.push(() => {
			outputCont.appendChild(message);
			if(messagesToAppend.length === 0)
				outputCont.scrollTo({ top: outputCont.scrollHeight, behavior: 'smooth' });

			if(kind === 'input' && !isTestDrive) {
				setTimeout(_ => lastInput.focus(), 320 + 80 * messagesBeforeInput);
			}
		});
		busyOutput = true;
	}

	return {
		success: /**@const @type {true}*/(true),
		outputCont,
		sendMessage,
	};
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
		console.log(savedData);
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

		if(result.inputStack.length) {
			sendMessage({
				kind: 'input',
				data: result.inputStack.map((input, i) => input.spread ? `${input.name}_0 ${input.name}_1 ... ${input.name}_N` : input.name).join(' '),
			});
		}

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
	if(!e.ctrlKey) return true;

	switch(e.key) {
	case 'Enter':
	case ' ':
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
});

executePS();
