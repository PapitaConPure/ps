import { ValuesOf } from '../util/types';
import { Lexer } from '.';

/**Contiene tipos de token de lexer*/
export const TokenKinds = ({
	//Valores
	LIT_NUMBER: 'Number',
	LIT_TEXT: 'String',
	LIT_BOOLEAN: 'Boolean',
	IDENTIFIER: 'Identifier',
	NADA: 'Nada',

	//Agrupación
	PAREN_OPEN: 'ParenOpen',
	PAREN_CLOSE: 'ParenClose',

	BLOCK_OPEN: 'BlockOpen',
	BLOCK_CLOSE: 'BlockClose',

	//Indicadores de Sentencia de Control
	IF: 'If',
	ELSE: 'Else',
	ELSE_IF: 'ElseIf',
	WHILE: 'While',
	DO: 'Do',
	UNTIL: 'Until',
	REPEAT: 'Repeat',
	FOR_EACH: 'ForEach',
	FOR: 'For',

	//Indicadores de sentencia
	READ: 'Read',
	CREATE: 'Create',
	SAVE: 'Save',
	LOAD: 'Load',
	ADD: 'Add',
	SUBTRACT: 'Subtract',
	MULTIPLY: 'Multiply',
	DIVIDE: 'Divide',
	EXTEND: 'Extend',
	DELETE: 'Delete',
	EXECUTE: 'Execute',
	RETURN: 'Return',
	END: 'End',
	STOP: 'Stop',
	SEND: 'Send',
	COMMENT: 'Comment',

	//Operadores lógicos
	OR: 'Or',
	AND: 'And',
	NOT: 'Not',

	//Operadores comparativos
	EQUALS: 'Equals',
	NOT_EQUALS: 'NotEquals',
	SEEMS: 'Seems',
	NOT_SEEMS: 'NotSeems',
	LESS: 'Less',
	LESS_EQUALS: 'LessEquals',
	GREATER: 'Greater',
	GREATER_EQUALS: 'GreaterEquals',

	//Operadores aritméticos
	PLUS: 'Plus',
	DASH: 'Dash',
	STAR: 'Star',
	SLASH: 'Slash',
	PERCENT: 'Percent',
	CARET: 'Caret',
	DOUBLE_STAR: 'DoubleStar',

	//Otros operadores
	ARROW: 'Arrow',
	COLON: 'Colon',
	COMMA: 'Comma',
	QUESTION: 'Question',
	LAMBDA: 'Lambda',
	AFTER: 'After',
	DOT: 'Dot',

	//Palabras clave
	ASSIGNMENT: 'Assignment',
	TIMES: 'Times',
	IN: 'In',
	FROM: 'From',
	OPTIONAL: 'Optional',
	AWAIT: 'Await',

	//Indicadores de Tipo
	NUMBER: 'NumberKind',
	TEXT: 'TextKind',
	BOOLEAN: 'BooleanKind',
	LIST: 'List',
	REGISTRY: 'Registry',
	EMBED: 'Embed',
	CANVAS: 'Lienzo',
	IMAGE: 'Imagen',
	INPUT: 'Input',
	FUNCTION: 'Function',

	//EOF
	EOF: 'EOF',
}) as const;
/**@description Representa un tipo de token de lexer.*/
export type TokenKind = ValuesOf<typeof TokenKinds>;

export const TokenKindTranslations = ({
	[TokenKinds.LIT_NUMBER]: 'Literal de Número',
	[TokenKinds.LIT_TEXT]: 'Literal de Texto',
	[TokenKinds.LIT_BOOLEAN]: 'Literal de Lógico',
	[TokenKinds.IDENTIFIER]: 'Identificador',

	[TokenKinds.PAREN_OPEN]: 'Inicio de agrupamiento `(`',
	[TokenKinds.PAREN_CLOSE]: 'Fin de agrupamiento `)`',
	[TokenKinds.BLOCK_OPEN]: 'Sentencia `BLOQUE`',
	[TokenKinds.BLOCK_CLOSE]: 'Sentencia `FIN`',
	[TokenKinds.IF]: 'Sentencia `SI`',
	[TokenKinds.ELSE]: 'Sentencia `SINO`',
	[TokenKinds.ELSE_IF]: 'Sentencias `SINO SI`',
	[TokenKinds.WHILE]: 'Sentencia `MIENTRAS`',
	[TokenKinds.DO]: 'Sentencia `HACER`',
	[TokenKinds.UNTIL]: 'Sentencia `HASTA` u operador especial `hasta`',
	[TokenKinds.REPEAT]: 'Sentencia `REPETIR`',
	[TokenKinds.FOR_EACH]: 'Sentencia `PARA CADA`',
	[TokenKinds.FOR]: 'Sentencia `PARA`',

	[TokenKinds.READ]: 'Sentencia `LEER`',
	[TokenKinds.CREATE]: 'Sentencia `CREAR`',
	[TokenKinds.SAVE]: 'Sentencia `GUARDAR`',
	[TokenKinds.LOAD]: 'Sentencia `CARGAR`',
	[TokenKinds.ADD]: 'Sentencia `SUMAR`',
	[TokenKinds.SUBTRACT]: 'Sentencia `RESTAR`',
	[TokenKinds.MULTIPLY]: 'Sentencia `MULTIPLICAR`',
	[TokenKinds.DIVIDE]: 'Sentencia `DIVIDIR`',
	[TokenKinds.EXTEND]: 'Sentencia `EXTENDER`',
	[TokenKinds.DELETE]: 'Sentencia `BORRAR`',
	[TokenKinds.EXECUTE]: 'Sentencia `EJECUTAR`',
	[TokenKinds.RETURN]: 'Sentencia `DEVOLVER`',
	[TokenKinds.END]: 'Sentencia `TERMINAR`',
	[TokenKinds.STOP]: 'Sentencia `PARAR`',
	[TokenKinds.SEND]: 'Sentencia `ENVIAR`',
	[TokenKinds.COMMENT]: 'Sentencia `COMENTAR`',

	[TokenKinds.OR]: 'Operador `o`',
	[TokenKinds.AND]: 'Operador `y`',
	[TokenKinds.NOT]: 'Operador `no`',

	[TokenKinds.EQUALS]: 'Operador `es`',
	[TokenKinds.NOT_EQUALS]: 'Operador `no es`',
	[TokenKinds.SEEMS]: 'Operador `parece`',
	[TokenKinds.NOT_SEEMS]: 'Operador `no parece`',
	[TokenKinds.LESS]: 'Operador `precede`',
	[TokenKinds.LESS_EQUALS]: 'Operador `no excede`',
	[TokenKinds.GREATER]: 'Operador `excede`',
	[TokenKinds.GREATER_EQUALS]: 'Operador `no precede`',

	[TokenKinds.ASSIGNMENT]: 'Operador `con`',
	[TokenKinds.ARROW]: 'Operador de flecha `->`',
	[TokenKinds.COLON]: 'Operador `:`',
	[TokenKinds.QUESTION]: 'Operador `?`',
	[TokenKinds.COMMA]: 'Operador `,`',
	[TokenKinds.LAMBDA]: 'Operador Lambda',
	[TokenKinds.TIMES]: 'Operador especial `veces`',
	[TokenKinds.AFTER]: 'Operador `luego`',
	[TokenKinds.DOT]: 'Operador `.`',
	[TokenKinds.IN]: 'Operador especial `en`',
	[TokenKinds.FROM]: 'Operador especial `desde`',
	[TokenKinds.OPTIONAL]: 'Operador especial `opcional`',
	[TokenKinds.AWAIT]: 'Operador `esperar`',

	[TokenKinds.PLUS]: 'Operador `+`',
	[TokenKinds.DASH]: 'Operador `-`',
	[TokenKinds.STAR]: 'Operador `*`',
	[TokenKinds.SLASH]: 'Operador `/`',
	[TokenKinds.PERCENT]: 'Operador `%`',
	[TokenKinds.CARET]: 'Operador `^`',
	[TokenKinds.DOUBLE_STAR]: 'Operador `**`',

	[TokenKinds.NUMBER]: 'Tipo Número',
	[TokenKinds.TEXT]: 'Tipo Texto',
	[TokenKinds.BOOLEAN]: 'Tipo Lógico',
	[TokenKinds.LIST]: 'Tipo Lista',
	[TokenKinds.REGISTRY]: 'Tipo Registro',
	[TokenKinds.EMBED]: 'Tipo Marco',
	[TokenKinds.CANVAS]: 'Tipo Lienzo',
	[TokenKinds.IMAGE]: 'Tipo Imagen',
	[TokenKinds.INPUT]: 'Tipo Entrada',
	[TokenKinds.FUNCTION]: 'Tipo Función',
	[TokenKinds.NADA]: 'Tipo u Valor Nada',

	[TokenKinds.EOF]: 'Fin de Código',

}) as const satisfies Record<TokenKind, string>;

export function translateTokenKind(tokenKind: TokenKind): string {
	return TokenKindTranslations[tokenKind];
}

export function translateTokenKinds(...tokenKinds: TokenKind[]): string[] {
	return tokenKinds.map(tokenKind => TokenKindTranslations[tokenKind]);
}

/**@description Contiene tipos de indicador de sentencia de lexer.*/
const StatementVerbs: Readonly<TokenKind[]> = ([
	TokenKinds.BLOCK_OPEN,
	TokenKinds.BLOCK_CLOSE,
	TokenKinds.IF,
	TokenKinds.ELSE,
	TokenKinds.ELSE_IF,
	TokenKinds.WHILE,
	TokenKinds.DO,
	TokenKinds.UNTIL,
	TokenKinds.REPEAT,
	TokenKinds.FOR_EACH,
	TokenKinds.FOR,
	TokenKinds.READ,
	TokenKinds.CREATE,
	TokenKinds.SAVE,
	TokenKinds.LOAD,
	TokenKinds.ADD,
	TokenKinds.SUBTRACT,
	TokenKinds.MULTIPLY,
	TokenKinds.DIVIDE,
	TokenKinds.EXTEND,
	TokenKinds.DELETE,
	TokenKinds.EXECUTE,
	TokenKinds.RETURN,
	TokenKinds.END,
	TokenKinds.STOP,
	TokenKinds.SEND,
	TokenKinds.COMMENT,
]) as const;

/**@description Contiene tipos de indicador de sentencia de lexer.*/
export const DataKindValues = ({
	NUMBER: 'Número',
	TEXT: 'Texto',
	BOOLEAN: 'Lógico',
	LIST: 'Lista',
	REGISTRY: 'Registro',
	EMBED: 'Marco',
	INPUT: 'Entrada',
}) as const;
/**@description Representa un tipo de Token Léxico de PuréScript.*/
export type DataKindValue = ValuesOf<typeof DataKindValues>;

export type TokenInternalValue = number | string | boolean | null | undefined;

/**Representa un Token Léxico de PuréScript*/
export class Token {
	/**@description El texto fuente de la línea original del token.*/
	#lexer: Lexer;
	/**@description El tipo del token.*/
	#kind: TokenKind;
	/**@description El valor del token.*/
	#value: TokenInternalValue;
	/**@description La línea del token.*/
	#line: number;
	/**@description La columna inicial del token.*/
	#column;
	/**@description La posición del primer caracter del token en el código.*/
	#start: number;
	/**@description El largo del token.*/
	#length: number;
	/**@description Si es un indicador de sentencia (`true`) o no (`false`).*/
	isStatement: boolean;

	/**
	 * @param lexer El Lexer que instanció este Token.
	 * @param kind El tipo de token.
	 * @param value El valor del token.
	 * @param line La línea del inicio del token.
	 * @param column La columna inicial del token.
	 * @param start La posición del primer caracter del token en el código.
	 * @param length El largo del token.
	 */
	constructor(lexer: Lexer, kind: TokenKind, value: TokenInternalValue, line: number, column: number, start: number, length: number) {
		if(!Object.values(TokenKinds).includes(kind))
			throw `Tipo de token inválido: ${kind}`;
		if(line < 1)
			throw 'La línea de inicio del token debe ser al menos 1';
		if(column < 1)
			throw 'La columna inicial del token debe ser al menos 1';
		if(start < 0)
			throw 'La posición de inicio del token debe ser al menos 0';
		if(length < 1)
			throw 'El largo del token debe ser al menos 1';

		this.#lexer = lexer;
		this.#kind = kind;
		this.#value = value;
		this.#line = line;
		this.#column = column;
		this.#start = start;
		this.#length = length;
		this.isStatement = StatementVerbs.includes(this.#kind);
	}

	/**@description El tipo de token.*/
	get kind() { return this.#kind; }

	get translated() {
		return TokenKindTranslations[this.#kind];
	}

	/**@description El valor del token.*/
	get value() { return this.#value; }

	/**@description La línea inicial del token.*/
	get line() { return this.#line; }

	/**@description La columna inicial del token.*/
	get column() { return this.#column; }

	/**@description La posición del primer caracter del token.*/
	get start() { return this.#start; }

	/**@description La posición del caracter al final del token.*/
	get end() { return this.#start + this.#length; }

	/**@description El largo del token*/
	get length() { return this.#length; }

	/**@description El fragmento de código fuente de la línea de origen del token.*/
	get lineString() {
		return this.#lexer.sourceLines[this.#line - 1];
	}

	/**@description El fragmento de código fuente que este token representa.*/
	get sourceString() {
		return this.#lexer.source.slice(this.start, this.end);
	}

	get json() {
		return {
			kind: this.#kind,
			value: this.#value,
			line: this.#line,
			column: this.#column,
			start: this.#start,
			end: this.end,
			length: this.#length,
			lineString: this.lineString,
			sourceString: this.sourceString,
		};
	}

	/**@description Devuelve `true` si el token es del tipo indicado, `false` de lo contrario.*/
	is<TInfer extends TokenKind>(tokenKind: TInfer): this is Token & { kind: TInfer } {
		return this.#kind === tokenKind;
	}

	/**@description Devuelve `true` si el token es de alguno de los tipos indicados, `false` de lo contrario.*/
	isAny<TInfer extends TokenKind[]>(...tokenKinds: TInfer): this is Token & { kind: TInfer[number] } {
		return (tokenKinds).includes(this.#kind);
	}

	get [Symbol.toStringTag]() {
		if(this.value == null)
			return this.#kind;

		return `${this.#kind} (${this.#value})`;
	}
}

Token.prototype.toString = function() {
	if(this.value == null)
		return this.kind;

	return `${this.kind} (${this.value})`;
};
