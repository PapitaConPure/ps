import { test, expect } from 'bun:test';
import { readdirSync } from 'node:fs';
import { readFileSync } from 'fs';
import { join } from 'node:path';
import { TokenKinds } from '../src/lexer/tokens';
import { CallExpression, ExpressionKinds, Identifier } from '../src/ast/expressions';
import { ExpressionStatement, ProgramStatement, StatementKinds } from '../src/ast/statements';
import { ValueKinds, RuntimeValue, NumberValue, ListValue, RegistryValue, EmbedValue, makeNumber, makeText, makeBoolean, makeList, makeRegistry, makeEmbed, makeNada, coerceValue, BooleanValue } from '../src/interpreter/values';
import { Lexer, Parser, Interpreter, Scope, declareNatives, declareContext, Input, stringifyPSAST, Token } from '../src';
import TestEnvironmentProvider from './testEnvironmentProvider';
import { EvaluationResult } from '../src/interpreter';
import { shortenText } from '../src/util/utils';
import chalk from 'chalk';

const testFiles: string[] = [];
const relPath = './tests/tubertests';
for(const filename of readdirSync(relPath).sort()) {
	const file = readFileSync(join(relPath, filename), { encoding: 'utf-8' });
	testFiles.push(file);
}

interface ExecutePSOptions {
	args?: string[];
	log?: boolean;
	skipInterpreter?: boolean;
	savedData?: Record<string, RuntimeValue>;
}

interface ExecutePSResult extends Partial<EvaluationResult> {
	lexer: Lexer;
	parser: Parser;
	interpreter: Interpreter;
	tokens?: Token[];
	tree?: ProgramStatement;
	scope?: Scope;
	provider?: TestEnvironmentProvider;
}

async function executePS(code: string, options: ExecutePSOptions = {}): Promise<ExecutePSResult> {
	const { args, log = false, skipInterpreter = false, savedData = {} } = options;
	const isTestDrive = (args == null);

	const lexer = new Lexer();
	const parser = new Parser();
	const interpreter = new Interpreter();

	const tokens = lexer.tokenize(code);
	if(log)
		console.table(tokens.map(token => ({ ...token.json, value: (typeof token.value === 'string') ? shortenText(token.value, 32, '[...]') : token.value })));

	const tree = parser.parse(tokens);
	if(log) {
		console.log(chalk.bold('\nÁrbol:'));
		console.log(stringifyPSAST(tree, 3));
	}

	if(skipInterpreter)
		return { lexer, parser, interpreter, tokens, tree };

	const scope = new Scope(interpreter);
	const provider = new TestEnvironmentProvider();
	declareNatives(scope);
	const actualSavedData = new Map<string, RuntimeValue>(Object.entries(savedData));
	await declareContext(scope, provider, actualSavedData);

	const result = await interpreter.evaluateProgram(tree, scope, code, provider, args, isTestDrive);
	if(log) {
		console.log(chalk.bold('\nResultado:'));
		console.log(stringifyPSAST(result));
		console.log('-'.repeat(119));
	}

	return {
		lexer,
		parser,
		interpreter,
		tokens,
		tree,
		scope,
		...result,
	};
}

test.concurrent('Piloto', async () => {
	const result = await executePS(testFiles[0]);
	const { inputStack, saveTable } = result;

	expect(inputStack.length).toBe(1);
	expect(inputStack[0]).toMatchObject(new Input('folladito', 'Text', false));

	const cosita = saveTable.get('cosita') as ListValue;
	expect(cosita.kind).toBe(ValueKinds.LIST);
	expect(cosita.elements[0]).toMatchObject(makeNumber(45));
	expect(cosita.elements[1]).toMatchObject(makeText('hola'));
	expect(cosita.elements[2]).toMatchObject(makeText('@ALEMSITA'));
	expect(cosita.elements[3]).toMatchObject(makeText('qué weá jaja'));
});

test.concurrent('Envío simple', async () => {
	const result = await executePS(testFiles[1]);
	const { sendStack } = result;

	expect(sendStack.length).toBe(1);
	expect(sendStack[0]).toMatchObject(makeNumber(50));
});

test.concurrent('Randomrain', async () => {
	const result = await executePS(testFiles[2]);
	const { sendStack } = result;

	expect(sendStack.length).toBe(1);
	expect(sendStack[0].kind).toBe(ValueKinds.EMBED);

	const inferredEmbed = (sendStack[0] as EmbedValue).value;
	expect(inferredEmbed.data.color).toBe(15844367);
	expect(inferredEmbed.data.fields?.length).toBe(1);
	expect(inferredEmbed.data.fields?.[0].name).toBe('Vas a ir con...');
	expect(inferredEmbed.data.fields?.[0].inline).toBe(false);
});

test.concurrent('Variables y Expresiones', async () => {
	const result = await executePS(testFiles[3]);
	const { interpreter, sendStack } = result;

	expect(sendStack.length).toBe(1);

	const a = makeNumber(-25.4);
	const b = makeNumber(3 * 2 + 2);
	const c = makeBoolean(a.value > b.value);
	const av = a.value;
	const bv = b.value;
	const cv = coerceValue(interpreter, c, ValueKinds.TEXT).value;

	expect(sendStack[0]).toMatchObject(makeText(`${av} ${bv} ${cv}`));
});

test.concurrent('Asignaciones complejas', async () => {
	const result = await executePS(testFiles[4]);
	const { sendStack } = result;

	expect(sendStack.length).toBe(7);

	expect(sendStack[0].kind).toBe(ValueKinds.LIST);
	const inferredList = sendStack[0] as ListValue;

	expect(inferredList.elements).toBeArrayOfSize(1);
	expect(inferredList.elements[0]).toMatchObject(makeNumber(911));

	expect(sendStack[1].kind).toBe(ValueKinds.REGISTRY);
	const inferredRegistry = sendStack[1] as RegistryValue;

	expect(inferredRegistry.entries.size).toBe(3);
	expect(inferredRegistry.entries.get('a')).toMatchObject(makeNumber(3));
	expect(inferredRegistry.entries.get('b')).toMatchObject(makeNumber(2));
	expect(inferredRegistry.entries.get('c')).toMatchObject(makeNumber(1));

	expect(sendStack[2]).toMatchObject(makeNumber(3));
	expect(sendStack[3]).toMatchObject(makeNumber(4));
	expect(sendStack[4]).toMatchObject(makeNumber(-3));
	expect(sendStack[5]).toMatchObject(makeNumber(-9));
	expect(sendStack[6]).toMatchObject(makeNumber(-4.5));
});

test.concurrent('Expresiones de flecha', async () => {
	const result = await executePS(testFiles[5]);
	const { sendStack } = result;

	expect(sendStack.length).toBe(20);

	expect(sendStack[0]).toMatchObject(makeNumber(42));
	expect(sendStack[1]).toMatchObject(makeNumber(69));

	expect(sendStack[2].kind).toBe(ValueKinds.REGISTRY);
	let inferredRegistry = sendStack[2] as RegistryValue;
	expect(inferredRegistry.entries.size).toBe(3);
	expect(inferredRegistry.entries.get('a')).toMatchObject(makeNumber(3));
	expect(inferredRegistry.entries.get('b')).toMatchObject(makeNumber(2));
	expect(inferredRegistry.entries.get('c')).toMatchObject(makeNumber(1));

	expect(sendStack[3]).toMatchObject(makeNumber(3));
	expect(sendStack[4]).toMatchObject(makeNumber(2));
	expect(sendStack[5]).toMatchObject(makeNumber(1));
	expect(sendStack[6]).toMatchObject(makeNumber(3));
	expect(sendStack[7]).toMatchObject(makeNumber(30));

	expect(sendStack[8].kind).toBe(ValueKinds.REGISTRY);
	inferredRegistry = sendStack[8] as RegistryValue;
	expect(inferredRegistry.entries.size).toBe(3);
	expect(inferredRegistry.entries.get('a')).toMatchObject(makeNumber(3));
	expect(inferredRegistry.entries.get('b')).toMatchObject(makeNumber(2));
	expect(inferredRegistry.entries.get('c')).toMatchObject(makeNumber(1));

	expect(sendStack[9].kind).toBe(ValueKinds.LIST);
	const inferredList = sendStack[9] as ListValue;
	expect(inferredList.elements.length).toBe(3);
	expect(inferredList.elements[0]).toMatchObject(makeNumber(3));
	expect(inferredList.elements[1]).toMatchObject(makeNumber(6));
	expect(inferredList.elements[2]).toMatchObject(makeNumber(9));

	expect(sendStack[10]).toMatchObject(makeNada());

	expect(sendStack[11]).toMatchObject(makeNumber(3));
	expect(sendStack[12]).toMatchObject(makeNumber(2));
	expect(sendStack[13]).toMatchObject(makeNumber(1));

	expect(sendStack[14]).toMatchObject(makeNumber(3));
	expect(sendStack[15]).toMatchObject(makeNumber(6));
	expect(sendStack[16]).toMatchObject(makeNumber(9));

	expect(sendStack[17]).toMatchObject(makeNumber(30));

	expect(sendStack[18].kind).toBe(ValueKinds.REGISTRY);
	expect(sendStack[19]).toMatchObject(makeNumber(42));
});

test.concurrent('Varias Entradas de Usuario I', async () => {
	const result = await executePS(testFiles[6]);
	const { inputStack, sendStack, returned } = result;

	expect(inputStack.length).toBe(4);

	expect(inputStack[0]).toMatchObject(new Input('a', ValueKinds.TEXT, false));
	expect(inputStack[1]).toMatchObject(new Input('b', ValueKinds.BOOLEAN, true));
	expect(inputStack[2]).toMatchObject(new Input('c', ValueKinds.NUMBER, false));
	expect(inputStack[3]).toMatchObject(new Input('d', ValueKinds.TEXT, true));

	expect(sendStack.length).toBe(1);
	expect(sendStack[0]).toMatchObject(makeText('Ingresa valores'));
	expect(returned).toMatchObject(makeText('Ingresa valores'));
});

test.concurrent('Varias Entradas de Usuario II', async () => {
	const result = await executePS(testFiles[6], {
		args: [ 'nwn', 'verdadero', '42', 'tiraba esa', '1', '2', '3', '4' ],
	});
	const { inputStack, sendStack, returned } = result;

	expect(inputStack.length).toBe(5);
	expect(inputStack[4].spread).toBe(true);

	expect(sendStack).toHaveLength(5);
	expect(sendStack[0]).toMatchObject(makeNumber(1));
	expect(sendStack[4]).toMatchObject(makeText('Bien'));

	const list = returned as ListValue;
	expect(list.elements.length).toBe(4);
	expect(list.elements[0]).toMatchObject(makeText('nwn'));
});

test.concurrent('Sentencias de retorno rápido', async () => {
	const result = await executePS(testFiles[7]);
	const { sendStack, returned } = result;

	expect(sendStack.length).toBe(1);
	expect(sendStack[0]).toMatchObject(makeText('holi'));
	expect(returned).toMatchObject(makeBoolean(true));
});

test.concurrent('Estructuras de control', async () => {
	const result = await executePS(testFiles[8]);
	const { returned } = result;

	expect(returned).toMatchObject(makeText('🥺'));
});

test.concurrent('Estructuras iterativas', async () => {
	const result = await executePS(testFiles[9]);
	const { sendStack } = result;

	expect(sendStack).toHaveLength(17);

	//REPETIR
	const text = makeText('wjat');
	for(let i = 0; i < 5; i++)
		expect(sendStack[i]).toMatchObject(text);

	//PARA CADA (Elementos de Lista)
	expect(sendStack[5]).toMatchObject(makeText('peruano'));
	expect(sendStack[6]).toMatchObject(makeText('chaibol'));
	expect(sendStack[7]).toMatchObject(makeText('poni'));

	//PARA CADA (Entradas de Registro)
	expect(sendStack[8]).toMatchObject(makeList([ makeText('a'), makeNumber(3) ]));
	expect(sendStack[9]).toMatchObject(makeList([ makeText('b'), makeNumber(2) ]));
	expect(sendStack[10]).toMatchObject(makeList([ makeText('c'), makeNumber(1) ]));

	//PARA Corto (PARA desde-hasta)
	expect(sendStack[11]).toMatchObject(makeNumber(3));
	expect(sendStack[12]).toMatchObject(makeNumber(4));
	expect(sendStack[13]).toMatchObject(makeNumber(5));

	//PARA Largo (PARA MIENTRAS)
	expect(sendStack[14]).toMatchObject(makeNumber(15));
	expect(sendStack[15]).toMatchObject(makeNumber(10));
	expect(sendStack[16]).toMatchObject(makeNumber(5));
});

test.concurrent('EJECUTAR + expresiones de flecha y llamado', async () => {
	const result = await executePS(testFiles[10], { skipInterpreter: true });
	const { tokens, tree } = result;

	expect(tokens.length).toBeWithin(64, 69);

	const statement = tree.body[0];

	expect(statement.kind).toBe(StatementKinds.EXPRESSION);
	const inferredExpr = statement as ExpressionStatement;

	expect(inferredExpr.expression.kind).toBe(ExpressionKinds.CALL);
	const inferredCallExpr = inferredExpr.expression as CallExpression;

	expect(inferredCallExpr.args).toBeArrayOfSize(0);

	expect(inferredCallExpr.fn.kind).toBe(ExpressionKinds.IDENTIFIER);
	const inferredIdentifier = inferredCallExpr.fn as Identifier;

	expect(inferredIdentifier.name).toBe('holaMundo');
});

test.concurrent('Expresión de función', async () => {
	const result = await executePS(testFiles[11]);
	const { sendStack } = result;

	expect(sendStack).toHaveLength(3);

	expect(sendStack[0]).toMatchObject(makeText('me cago en la puta'));
	expect(sendStack[1]).toMatchObject(makeText('maraco'));
	expect(sendStack[2]).toMatchObject(makeNumber(111));
});

test.concurrent('Casteos Primitivos de expresiones', async () => {
	const result = await executePS(testFiles[12]);
	const { sendStack } = result;

	expect(sendStack[0]).toMatchObject(makeNumber(1));
	expect(sendStack[1]).toMatchObject(makeText('22'));
	expect(sendStack[2]).toMatchObject(makeText('4'));
	expect(sendStack[3]).toMatchObject(makeNumber(6));
	expect(sendStack[4]).toMatchObject(makeNumber(62));
	expect(sendStack[5]).toMatchObject(makeBoolean(true));
});

test.concurrent('Funciones nativas', async () => {
	Array.from({ length: 1 }, async () => { //Aumentar length si se quiere testear a profundidad
		const result = await executePS(testFiles[13]);
		const { sendStack } = result;

		let inferredNumber: NumberValue;

		expect(sendStack[0].kind).toBe(ValueKinds.NUMBER);
		inferredNumber = sendStack[0] as NumberValue;
		expect(inferredNumber.value).toBeInteger();
		expect(inferredNumber.value).toBeWithin(1, 7);

		expect(sendStack[1].kind).toBe(ValueKinds.NUMBER);
		inferredNumber = sendStack[1] as NumberValue;
		expect(inferredNumber.value).toBeInteger();
		expect(inferredNumber.value).toBeWithin(0, 1000);

		expect(sendStack[2].kind).toBe(ValueKinds.NUMBER);
		inferredNumber = sendStack[2] as NumberValue;
		expect(inferredNumber.value).toBeInteger();
		expect(inferredNumber.value).toBeWithin(-10, -5);

		expect(sendStack[3].kind).toBe(ValueKinds.NUMBER);
		inferredNumber = sendStack[3] as NumberValue;
		expect(inferredNumber.value).not.toBeInteger();
		expect(inferredNumber.value).toBeWithin(0, 1);

		expect(sendStack[4].kind).toBe(ValueKinds.NUMBER);
		inferredNumber = sendStack[4] as NumberValue;
		expect(inferredNumber.value).not.toBeInteger();
		expect(inferredNumber.value).toBeWithin(0, 1000);

		expect(sendStack[5].kind).toBe(ValueKinds.NUMBER);
		inferredNumber = sendStack[5] as NumberValue;
		expect(inferredNumber.value).not.toBeInteger();
		expect(inferredNumber.value).toBeWithin(-100, -5);
	});
});

test.concurrent('Métodos nativos', async () => {
	const result = await executePS(testFiles[14]);
	const { sendStack } = result;

	expect(sendStack[0]).toMatchObject(makeNumber(44));
	expect(sendStack[1]).toMatchObject(makeText('HOLA MUNDO'));
	expect(sendStack[2]).toMatchObject(makeText('100 ponis, 200 ponis, 300'));
	expect(sendStack[3]).toMatchObject(makeText('a... b... c'));
	expect(sendStack[4]).toMatchObject(makeText('3... 2... 1'));
	expect(sendStack[5]).toMatchObject(makeText('[a: 3] - - [b: 2] - - [c: 1]'));
});

test.concurrent('Secuencias y Lambdas', async () => {
	const result = await executePS(testFiles[15]);
	const { sendStack } = result;

	expect(sendStack[0]).toMatchObject(makeText('2, 4, 6, 8, 10, 12, 14, 16, 18, 20, '));
	expect(sendStack[1]).toMatchObject(makeText('4, 8, 12, 16, 20, 24, 28, 32, 36, 40, '));
	expect(sendStack[2].kind).toBe('Function');
	expect(sendStack[3]).toMatchObject(makeNumber(15));
	expect(sendStack[4].kind).toBe('Function');
	expect(sendStack[5]).toMatchObject(makeNumber(3));
});

test.concurrent('Creación, modificación y envío de Marco', async () => {
	const result = await executePS(testFiles[16]);
	const { sendStack } = result;

	expect(sendStack[0].kind).toBe(ValueKinds.EMBED);
	const inferredEmbed = sendStack[0] as EmbedValue;
	expect(inferredEmbed.value.data.author.name).toBe('Papita');
	expect(inferredEmbed.value.data.fields[0].name).toBe('Hola');
	expect(inferredEmbed.value.data.fields[0].value).toBe('Mundo');
});

test.concurrent('Funciones impuras', async () => {
	const result = await executePS(testFiles[17]);
	const { sendStack } = result;

	expect(sendStack[0]).toMatchObject(
		makeList([
			makeText('Burundanga'),
			makeText('wasd'),
		])
	);
	expect(sendStack[1]).toMatchObject(makeText('Esto no debería hacer nada más'));
	expect(sendStack[2]).toMatchObject(
		makeList([
			makeText('Mondongo'),
			makeText('wasd'),
		])
	);
	expect(sendStack[3]).toMatchObject(
		makeRegistry({
			nombre: makeText('Sebastián'),
			profesión: makeText('Pícaro'),
		})
	);
	expect(sendStack[4]).toMatchObject(
		makeRegistry({
			nombre: makeText('Sebastián'),
			profesión: makeText('Pícaro'),
			lol: makeText('lmao'),
		})
	);
});

test.concurrent('Retorno de Funciones y Ámbito de Función', async () => {
	const result = await executePS(testFiles[18]);
	const { sendStack, returned } = result;

	expect(sendStack).toBeArrayOfSize(0);
	expect(returned).toMatchObject(makeNumber(109));
});

test.concurrent('Recursividad', async () => {
	const result = await executePS(testFiles[19]);
	const { returned } = result;

	expect(returned).toMatchObject(makeNumber(720));
});

test.concurrent('Guardar y Cargar (Primera Ejecución)', async () => {
	const result = await executePS(testFiles[20]);
	const { sendStack, saveTable } = result;

	expect(sendStack[0]).toMatchObject(makeNumber(0));
	expect(saveTable.has('valor')).toBeTrue();
	expect(saveTable.get('valor')).toMatchObject(makeNumber(1));
});

test.concurrent('Guardar y Cargar (Ejecución Ordinaria)', async () => {
	const result = await executePS(testFiles[20], {
		savedData: {
			valor: makeNumber(3),
		},
	});
	const { sendStack, saveTable } = result;

	expect(sendStack[0]).toMatchObject(makeNumber(3));
	expect(saveTable.has('valor')).toBeTrue();
	expect(saveTable.get('valor')).toMatchObject(makeNumber(4));
});

test.concurrent('Daño de Risko', async () => {
	const result = await executePS(testFiles[21]);
	const { sendStack } = result;

	expect(sendStack[0].kind).toBe(ValueKinds.EMBED);
	const inferredEmbed = sendStack[0] as EmbedValue;

	const embed = makeEmbed();
	embed.value
		.setColor(5793266)
		.setTitle('Tabla de daños')
		.addFields(
			{ name: 'Base', value: '4', inline: false },
			{ name: 'Crítico', value: '48', inline: true, },
			{ name: 'Peor', value: '24', inline: true, },
			{ name: 'Mejor', value: '1140.48', inline: true, },
			{ name: 'Vs. jefe', value: '57.6', inline: true, },
			{ name: '>90% HP', value: '132', inline: true, },
			{ name: 'De cerca', value: '43.2', inline: true, },
			{ name: '...jefe', value: '115.2', inline: true, },
			{ name: '...>90% HP', value: '264', inline: true, },
			{ name: '...cerca', value: '86.4', inline: true, },
			{ name: '...jefe >90% HP', value: '633.6', inline: true, },
			{ name: '...jefe cerca', value: '207.36', inline: true, },
		);

	expect(inferredEmbed).toMatchObject(embed);
});

test.concurrent('Guardar y Cargar Listas (Primera Ejecución)', async () => {
	const result = await executePS(testFiles[22]);
	const { sendStack, saveTable } = result;

	const savedList = makeList([
		makeNumber(0),
	]);

	expect(sendStack[0]).toMatchObject(savedList);
	expect(saveTable.has('valores')).toBeTrue();
	expect(saveTable.get('valores')).toMatchObject(savedList);
});

test.concurrent('Guardar y Cargar Listas (Ejecución Ordinaria)', async () => {
	const savedList = makeList([
		makeNumber(0),
		makeNumber(1),
		makeNumber(2),
		makeNumber(3),
	]);

	const result = await executePS(testFiles[22], {
		savedData: {
			valores: makeList([ ...savedList.elements ]),
		},
	});
	const { sendStack, saveTable } = result;

	savedList.elements.push(makeNumber(4));

	expect(sendStack[0]).toMatchObject(savedList);
	expect(saveTable.has('valores')).toBeTrue();
	expect(saveTable.get('valores')).toMatchObject(savedList);
});

test.concurrent('Error con Entradas Extensivas', async () => {
	expect(
		executePS(testFiles[23])
	).rejects.toThrow();
});

test.concurrent('Juego de Bomba', async () => {
	const result = await executePS(testFiles[24]);
	const { sendStack, saveTable } = result;

	expect(saveTable.has('contador')).toBeTrue();
	const contador = saveTable.get('contador');

	expect(contador.kind).toBe(ValueKinds.NUMBER);
	const inferredNumber = contador as NumberValue;

	if(sendStack[0].equals(makeText('pum!!'))) {
		expect(inferredNumber.value).toBeGreaterThan(0);
		expect(sendStack[0]).toMatchObject(makeText('pum!!'));
	} else {
		expect(inferredNumber).toBeGreaterThanOrEqual(0);
		expect(sendStack[0]).toMatchObject(makeText('...'));
	}
});

test.concurrent('Guardado Inválido de Marco', async () => {
	expect(
		executePS(testFiles[25])
	).rejects.toThrow();
});

test.concurrent('Formatos de Entrada (Primera Ejecución)', async () => {
	const result = await executePS(testFiles[26]);
	const { sendStack } = result;

	expect(sendStack[0]).toMatchObject(makeNumber(23));
	expect(sendStack[1]).toMatchObject(makeText('W'));
	expect(sendStack[2]).toMatchObject(makeBoolean(true));
	expect(sendStack[3]).toMatchObject(makeText('C'));
	expect(sendStack[4]).toMatchObject(makeText('A'));
	expect(sendStack[5]).toMatchObject(makeNumber(50));
	expect(sendStack[6]).toMatchObject(makeNumber(0.5));
	expect(sendStack[7]).toMatchObject(makeText('touché'));
	expect(sendStack[8]).toMatchObject(makeText('è'));
});

test.concurrent('Formatos de Entrada (Ejecución Ordinaria)', async () => {
	const result = await executePS(testFiles[26], {
		args: [ '2', 'WhAT', 'yay', 'Verdadero', '3', '0.7', '0.25', 'EN EFECTO', 'Magnífico' ],
	});
	const { sendStack } = result;

	expect(sendStack[0]).toMatchObject(makeNumber(10));
	expect(sendStack[1]).toMatchObject(makeText('what'));
	expect(sendStack[2]).toMatchObject(makeBoolean(true));
	expect(sendStack[3]).toMatchObject(makeText('A'));
	expect(sendStack[4]).toMatchObject(makeText('C'));
	expect(sendStack[5]).toMatchObject(makeNumber(70));
	expect(sendStack[6]).toMatchObject(makeNumber(0.25));
	expect(sendStack[7]).toMatchObject(makeText('En efecto'));
	expect(sendStack[8]).toMatchObject(makeText('magnifico'));
});

test.concurrent('Formatos de Entrada (Ejecución Ordinaria 2)', async () => {
	const result = await executePS(testFiles[26], {
		args: [ '12.5', '', 'nay', 'Falso', '5', '60%', '30%', 'minus', 'INCREÍBLE' ],
	});
	const { sendStack } = result;

	expect(sendStack[0]).toMatchObject(makeNumber(12));
	expect(sendStack[1]).toMatchObject(makeText(''));
	expect(sendStack[2]).toMatchObject(makeBoolean(false));
	expect(sendStack[3]).toMatchObject(makeText('B'));
	expect(sendStack[4]).toMatchObject(makeText('E'));
	expect(sendStack[5]).toMatchObject(makeNumber(60));
	expect(sendStack[6]).toMatchObject(makeNumber(0.3));
	expect(sendStack[7]).toMatchObject(makeText('Minus'));
	expect(sendStack[8]).toMatchObject(makeText('increible'));
});

test.concurrent('Terraria', async () => {
	const result = await executePS(testFiles[27]);
	const { sendStack } = result;

	expect(sendStack[0]).toMatchObject(
		makeText('Terraria es un juego de Acción/Aventura para PC, Consolas, Móvil. Salió en 2011')
	);
});

test.concurrent('Predicados', async () => {
	const result = await executePS(testFiles[28]);
	const { sendStack } = result;

	expect(sendStack[1]).toMatchObject(makeText('Simple: 1, 3, 4, 2, 8, 9, 10, 5, 6, 7'));
	expect(sendStack[2]).toMatchObject(makeText('Ordenada: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10'));
	expect(sendStack[3]).toMatchObject(makeText('OrdLambda: 10, 9, 8, 7, 6, 5, 4, 3, 2, 1'));
	expect(sendStack[4]).toMatchObject(makeText('Simple después de ordenar: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10'));
	expect(sendStack[5]).toMatchObject(makeText('Filtro: 6, 7, 8, 9, 10'));
	expect(sendStack[6]).toMatchObject(makeText('Mapeo: 2, 4, 6, 8, 10, 12, 14, 16, 18, 20'));
	expect(sendStack[7]).toMatchObject(makeText('BuscarEl: 5'));
	expect(sendStack[8]).toMatchObject(makeText('BuscarId: 4'));
	expect(sendStack[9]).toMatchObject(makeText('NoEncuEl: Nada'));
	expect(sendStack[10]).toMatchObject(makeText('NoEncuId: -1'));
	expect(sendStack[11]).toMatchObject(makeText('Algún: Verdadero'));
	expect(sendStack[12]).toMatchObject(makeText('AlgúnMal: Falso'));
	expect(sendStack[13]).toMatchObject(makeText('Todos: Verdadero'));
	expect(sendStack[14]).toMatchObject(makeText('TodosMal: Falso'));
	expect(sendStack[15]).toMatchObject(makeText('Simple después de cha cha: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10'));
	expect(sendStack[17]).toMatchObject(makeText('Simple: {Rg a: 1, c: 3, f: 6, b: 2, d: 4, e: 5, g: 7 }'));
	expect(sendStack[18]).toMatchObject(makeText('Filtrado: {Rg a: 1, f: 6, e: 5, g: 7 }'));
	expect(sendStack[19]).toMatchObject(makeText('Simple después de cha cha: {Rg a: 1, c: 3, f: 6, b: 2, d: 4, e: 5, g: 7, aPiola: 2, cPiola: 6, fPiola: 12, bPiola: 4, dPiola: 8, ePiola: 10, gPiola: 14 }'));
});

test.concurrent('Formateo de Números', async () => {
	const result = await executePS(testFiles[29]);
	const { sendStack } = result;

	expect(sendStack[0]).toMatchObject(makeText('042.00 cuatrillones'));
	expect(sendStack[1]).toMatchObject(makeText('42,000,000,000,000,000,000,000,000'));
	expect(sendStack[2]).toMatchObject(makeText('300.00 trillones'));
	expect(sendStack[3]).toMatchObject(makeText('3,000'));
	expect(sendStack[4]).toMatchObject(makeText('003,000'));
});

test.concurrent('Mismo identificador en Funciones', async () => {
	const result = await executePS(testFiles[30]);
	const { sendStack } = result;

	expect(sendStack[0]).toMatchObject(makeText('chocolate'));
	expect(sendStack[1]).toMatchObject(makeText('caramelo'));
});

test.concurrent('Asignación en mientras', async () => {
	const result = await executePS(testFiles[31]);
	const { sendStack } = result;

	expect(sendStack.length).toBe(1);
	expect(sendStack[0]).toMatchObject(makeBoolean(true));
});

test.concurrent('Elegir de Lista', async () => {
	const result = await executePS(testFiles[32]);
	const { sendStack } = result;

	expect(sendStack.length).toBe(2);
	expect(sendStack[0].kind).toBe(ValueKinds.LIST);
	expect(sendStack[1].kind).toBe(ValueKinds.NUMBER);
});

test.concurrent('Operador luego (Primera Ejecución)', async () => {
	const result = await executePS(testFiles[33]);
	const { sendStack } = result;

	expect(sendStack.length).toBe(1);
	expect(sendStack[0]).toMatchObject(makeText('¡Hola Mundo!'));
});

test.concurrent('Operador luego (Ejecución Ordinaria)', async () => {
	const result = await executePS(testFiles[33], {
		args: [ 'Una Entrada de Usuario cualquiera' ]
	});
	const { sendStack } = result;

	expect(sendStack.length).toBe(1);
	expect(sendStack[0]).toMatchObject(makeNumber(42));
});

test.concurrent('Cargar Condicional', async () => {
	const result = await executePS(testFiles[34]);
	const { sendStack } = result;

	expect(sendStack.length).toBe(1);
	expect(sendStack[0]).toMatchObject(makeNumber(42));
});

test.concurrent('Expresiones Condicionales', async () => {
	const result = await executePS(testFiles[35]);
	const { sendStack } = result;

	expect(sendStack.length).toBe(2);
	expect(sendStack[0]).toMatchObject(makeText('wenamechaindesama'));
	expect(sendStack[1]).toMatchObject(makeText('burundanga'));
});

test.concurrent('tipoDe()', async () => {
	const result = await executePS(testFiles[36]);
	const { sendStack } = result;

	expect(sendStack.length).toBe(9);
	expect(sendStack[0]).toMatchObject(makeText('número'));
	expect(sendStack[1]).toMatchObject(makeText('texto'));
	expect(sendStack[2]).toMatchObject(makeText('lógico'));
	expect(sendStack[3]).toMatchObject(makeText('lista'));
	expect(sendStack[4]).toMatchObject(makeText('registro'));
	expect(sendStack[5]).toMatchObject(makeText('marco'));
	expect(sendStack[6]).toMatchObject(makeText('función'));
	expect(sendStack[7]).toMatchObject(makeText('nada'));
	expect(sendStack[8]).toMatchObject(makeText('función'));
});

test.concurrent('Texto->acotar() Texto->normalizar()', async () => {
	const result = await executePS(testFiles[37]);
	const { sendStack } = result;

	expect(sendStack.length).toBe(2);
	expect(sendStack[0]).toMatchObject(makeText('El que no disfruta de la soledad, no amará a la libertad'));
	expect(sendStack[1]).toMatchObject(makeText('el que no disfruta de la soledad, no amara a la libertad'));
});

test.concurrent('"este"', async () => {
	const result = await executePS(testFiles[38]);
	const { sendStack } = result;

	expect(sendStack.length).toBe(4);
	expect(sendStack[0]).toMatchObject(makeText('Bark'));
	expect(sendStack[1]).toMatchObject(makeText('Moo'));
	expect(sendStack[2]).toMatchObject(makeText('BAU BAU'));
	expect(sendStack[3]).toMatchObject(makeText('conchetumare'));
});

test.concurrent('"esperar"', async () => {
	const result = await executePS(testFiles[39]);
	const { sendStack, returned } = result;

	expect(sendStack[0]).toMatchObject(makeText('holaaaaa nwn'));
	expect(returned).toMatchObject(makeNada());
});

test.concurrent('Obtener gatos', async () => {
	const result = await executePS(testFiles[40]);
	const { sendStack, returned } = result;

	expect(returned.kind).toBe(ValueKinds.REGISTRY);
	const inferredRegistry = returned as RegistryValue;

	expect(inferredRegistry.entries.has('éxito')).toBeTrue();
	const inferredSuccessEntry = inferredRegistry.entries.get('éxito') as BooleanValue;

	expect(inferredRegistry.entries.has('código')).toBeTrue();
	const inferredStatusEntry = inferredRegistry.entries.get('código') as NumberValue;

	expect(inferredSuccessEntry.kind).toBe('Boolean');
	expect(inferredStatusEntry.kind).toBe('Number');

	if(inferredSuccessEntry.value) {
		expect(inferredRegistry.entries.has('datos')).toBeTrue();
		expect(inferredRegistry.entries.get('datos').kind).toBe(ValueKinds.REGISTRY);
	} else {
		expect(inferredRegistry.entries.has('mensaje')).toBeTrue();
	}

	expect(sendStack[0]).toMatchObject(makeText('wah'));
});

test.concurrent('"esperar" con estructuras de control', async () => {
	const result = await executePS(testFiles[41]);
	const { sendStack, returned } = result;

	expect(sendStack[0]).toMatchObject(makeText('valores de l: 0, 1, 2, 3, 4'));
	expect(sendStack[1]).toMatchObject(makeText('wawa'));
	expect(returned).toMatchObject(makeNada());
});

test.concurrent('Evitar operador "no es" al colocar "no" frente a "esNúmero" o similares', async () => {
	const result = await executePS(testFiles[42], { log: true });
	const { tokens, sendStack, returned } = result;

	expect(tokens[ 7].kind).toBe(TokenKinds.IF);
	expect(tokens[ 8].kind).toBe(TokenKinds.NOT);
	expect(tokens[ 9].kind).toBe(TokenKinds.IDENTIFIER);
	expect(tokens[10].kind).toBe(TokenKinds.PAREN_OPEN);
	expect(tokens[11].kind).toBe(TokenKinds.IDENTIFIER);
	expect(tokens[12].kind).toBe(TokenKinds.PAREN_CLOSE);

	expect(sendStack[0]).toMatchObject(makeText('No es un número'));
	expect(sendStack[1]).toMatchObject(makeText('Es un número'));
	expect(sendStack[2]).toMatchObject(makeText('No es un número'));
	expect(returned).toMatchObject(makeNada());
});
