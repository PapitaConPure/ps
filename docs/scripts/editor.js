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

/**
 * 
 * @param {{ content?: string, embeds?: string }} options 
 */
function createMessage(options) {
	const { content = null, embeds = null } = options;

	embeds && message.classList.add('embed-message');
	outputCont.appendChild(message);
}

async function executePS() {
	const puréscript = editor.getDoc().getValue().trim();
	const outputCont = document.getElementById('output');
	const resultArea = document.getElementById('result');

	outputCont.innerHTML = '';

	try {
		const tokens = lexer.tokenize(puréscript);
		const tree = parser.parse(tokens);
		const scope = new Scope(interpreter);
		const provider = new BrowserEnvironmentProvider();
		declareNatives(scope);
		await declareContext(scope, provider);

		const isTestDrive = true; //PENDIENTE?
		const args = []; //PENDIENTE

		const result = interpreter.evaluateProgram(tree, scope, puréscript, provider, args, isTestDrive);

		if(!result.sendStack.length) {
			const notice = document.createElement('div');
			notice.classList.add('text-message', 'message-error');
			notice.textContent = 'No se envió ningún mensaje';
			outputCont.appendChild(notice);
			return;
		}

		const contentLines = [];
		result.sendStack.forEach(value => {
			if(value.kind === 'Embed') return;
			contentLines.push(stringifyValue(value));
		});
		console.log(contentLines);
		
		if(contentLines) {
			const message = document.createElement('div');
			message.classList.add('text-message');
			message.textContent = contentLines.join('\n');
			outputCont.appendChild(message)
		};

		resultArea.value = (result.returned.kind === 'Nada') ? '' : `${stringifyValue(result.returned)}`;
	} catch(e) {
		console.error(e);
		resultArea.value = `ERROR — ${e.name}

LO QUÉ OCURRIÓ:
${e.message.slice('```arm\n'.length).replace('\n```\n', '\n\n')}
`;
	}
}
