const path = require('path');
const chalk = require('chalk');
const { stringifyPSAST, Lexer, Parser, Interpreter, Scope, declareNatives, declareContext, Input } = require('../src/index.js');
const { readFileSync } = require('fs');
const { shortenText, iota } = require('../src/util/utils.js');
const { makeNumber, makeText, makeBoolean, coerceValue, ValueKinds, makeNada, makeRegistry } = require('../src/interpreter/values.js');
const { TestEnvironmentProvider } = require('./testEnvironmentProvider.js');

//#region Tests
/**@param {*} value*/
function expect(value) {
	const stringified = (/**@type {*}*/v) => v != null ? (v.value ?? v.elements ?? v.entries ?? v.toString()) : v;

	/**@param {*} other*/
	function toBe(other) {
		let valuesAreEqual;
		if(value != null && typeof value.equals === 'function') {
			const test = value.equals(other);
			valuesAreEqual = test.value ?? test;
		} else
			valuesAreEqual = value === other;

		if(!valuesAreEqual)
			throw new Error(`Los valores no coinciden: «${stringified(value)}», «${stringified(other)}»`);

		return {
			toDo,
		};
	}

	/**@param {(other: *) => Boolean} test*/
	function toDo(test) {
		if(!test(value))
			throw new Error(`Los valores no pasan la prueba: «${test.name}»(«${stringified(value)}»)`);

		return {
			toDo,
		};
	}

	return {
		toBe,
		toDo,
	};
}

const log = true;
const skipInterpreter = true;
const untested = _ => null;

const Results = /**@type {const}*/({
	SUCCESS: iota(0),
	FAILURE: iota(),
});

const relPath = './tests/tubertests';
const filenamePrefix = 'script';
const filenamePostfix = '.tuber';

/**
 * @typedef {Object} Test
 * @property {Number} file
 * @property {import('../src/util/types.js').ValuesOf<Results>} expect
 * @property {(result: import('../src/interpreter/interpreter.js').EvaluationResult) => *} test
 * @property {String} label
 * @property {Array<String>} [args]
 * @property {Boolean} [log]
 * @property {Boolean} [skipInterpreter]
 * @property {String} [error]
 */
/**@type {Array<Test>}*/
const tests = [
	{
		file:  0,
		label: 'Piloto',
		expect: Results.SUCCESS,
		test: function({ inputStack, saveTable }) {
			expect(inputStack.length).toBe(1);
			expect(inputStack[0]).toBe(new Input('folladito', 'Text', false));
			
			const cosita = /**@type {import('../src/interpreter/values.js').ListValue}*/(saveTable.get('cosita'));
			expect(cosita.kind).toBe('List');
			expect(cosita.elements[0]).toBe(makeNumber(45));
			expect(cosita.elements[1]).toBe(makeText('hola'));
			expect(cosita.elements[2]).toBe(makeText('@ALEMSITA'));
			expect(cosita.elements[3]).toBe(makeText('qué weá jaja'));
		},
	},
	{
		file: 1,
		label: 'Envío simple',
		expect: Results.SUCCESS,
		test: function({ sendStack }) {
			expect(sendStack.length).toBe(1);
			expect(sendStack[0]).toBe(makeNumber(50));
		},
	},
	{
		file: 2,
		label: 'Randomrain',
		expect: Results.SUCCESS,
		test: function({ sendStack }) {
			expect(sendStack.length).toBe(1);
			expect(sendStack[0].kind).toBe('Embed');

			const inferredEmbed = (/**@type {import('../src/interpreter/values.js').EmbedValue}*/(sendStack[0])).value;
			expect(inferredEmbed.data.color).toBe(15844367);
			expect(inferredEmbed.data.fields?.length).toBe(1);
			expect(inferredEmbed.data.fields?.[0].name).toBe('Vas a ir con...');
			expect(inferredEmbed.data.fields?.[0].inline).toBe(false);
		},
	},
	{
		file: 3,
		label: 'Variables y Expresiones',
		expect: Results.SUCCESS,
		test: function({ sendStack }) {
			expect(sendStack.length).toBe(1);

			const a = makeNumber(-25.4);
			const b = makeNumber(3 * 2 + 2);
			const c = makeBoolean(a.value > b.value);
			const av = a.value;
			const bv = b.value;
			const cv = coerceValue(interpreter, c, ValueKinds.TEXT).value;
			const result = makeText(av + ' ' + bv + ' ' + cv);
			expect(sendStack[0]).toBe(result);
		},
	},
	{
		file: 4,
		label: 'Asignaciones complejas',
		expect: Results.SUCCESS,
		test: function({ sendStack }) {
			expect(sendStack.length).toBe(7);

			expect(sendStack[0].kind).toBe(ValueKinds.LIST);
			const inferredList = /**@type {import('../src/interpreter/values.js').ListValue}*/(sendStack[0]);
			expect(inferredList.elements.length).toBe(1);
			expect(inferredList.elements[0]).toBe(makeNumber(911));

			expect(sendStack[1].kind).toBe(ValueKinds.REGISTRY);
			const inferredRegistry = /**@type {import('../src/interpreter/values.js').RegistryValue}*/(sendStack[1]);
			expect(inferredRegistry.entries.size).toBe(3);
			expect(inferredRegistry.entries.get('a')).toBe(makeNumber(3));
			expect(inferredRegistry.entries.get('b')).toBe(makeNumber(2));
			expect(inferredRegistry.entries.get('c')).toBe(makeNumber(1));

			expect(sendStack[2]).toBe(makeNumber(3));
			expect(sendStack[3]).toBe(makeNumber(4));
			expect(sendStack[4]).toBe(makeNumber(-3));
			expect(sendStack[5]).toBe(makeNumber(-9));
			expect(sendStack[6]).toBe(makeNumber(-4.5));
		},
	},
	{
		file: 5,
		label: 'Expresiones de flecha',
		expect: Results.SUCCESS,
		test: function({ sendStack }) {
			expect(sendStack.length).toBe(20);

			expect(sendStack[0]).toBe(makeNumber(42));
			expect(sendStack[1]).toBe(makeNumber(69));

			expect(sendStack[2].kind).toBe(ValueKinds.REGISTRY);
			let inferredRegistry = /**@type {import('../src/interpreter/values.js').RegistryValue}*/(sendStack[2]);
			expect(inferredRegistry.entries.size).toBe(3);
			expect(inferredRegistry.entries.get('a')).toBe(makeNumber(3));
			expect(inferredRegistry.entries.get('b')).toBe(makeNumber(2));
			expect(inferredRegistry.entries.get('c')).toBe(makeNumber(1));

			expect(sendStack[3]).toBe(makeNumber(3));
			expect(sendStack[4]).toBe(makeNumber(2));
			expect(sendStack[5]).toBe(makeNumber(1));
			expect(sendStack[6]).toBe(makeNumber(3));
			expect(sendStack[7]).toBe(makeNumber(30));

			expect(sendStack[8].kind).toBe(ValueKinds.REGISTRY);
			inferredRegistry = /**@type {import('../src/interpreter/values.js').RegistryValue}*/(sendStack[8]);
			expect(inferredRegistry.entries.size).toBe(3);
			expect(inferredRegistry.entries.get('a')).toBe(makeNumber(3));
			expect(inferredRegistry.entries.get('b')).toBe(makeNumber(2));
			expect(inferredRegistry.entries.get('c')).toBe(makeNumber(1));

			expect(sendStack[9].kind).toBe(ValueKinds.LIST);
			let inferredList = /**@type {import('../src/interpreter/values.js').ListValue}*/(sendStack[9]);
			expect(inferredList.elements.length).toBe(3);
			expect(inferredList.elements[0]).toBe(makeNumber(3));
			expect(inferredList.elements[1]).toBe(makeNumber(6));
			expect(inferredList.elements[2]).toBe(makeNumber(9));

			expect(sendStack[10]).toBe(makeNada());

			expect(sendStack[11]).toBe(makeNumber(3));
			expect(sendStack[12]).toBe(makeNumber(2));
			expect(sendStack[13]).toBe(makeNumber(1));

			expect(sendStack[14]).toBe(makeNumber(3));
			expect(sendStack[15]).toBe(makeNumber(6));
			expect(sendStack[16]).toBe(makeNumber(9));

			expect(sendStack[17]).toBe(makeNumber(30));

			expect(sendStack[18].kind).toBe(ValueKinds.REGISTRY);
			expect(sendStack[19]).toBe(makeNumber(42));
		},
	},
	{
		file: 6,
		label: 'Varias Entradas de Usuario I',
		expect: Results.SUCCESS,
		test: function({ inputStack, sendStack, returned }) {
			expect(inputStack.length).toBe(4);

			/**@type {(a: Input, b: Input) => boolean}*/
			const compareInputs = (input, otherInput) => input.equals(otherInput);
			expect(inputStack[0]).toDo(i => compareInputs(i, new Input('a', 'Text', false)));
			expect(inputStack[1]).toDo(i => compareInputs(i, new Input('b', 'Boolean', true)));
			expect(inputStack[2]).toDo(i => compareInputs(i, new Input('c', 'Number', false)));
			expect(inputStack[3]).toDo(i => compareInputs(i, new Input('d', 'Text', true)));

			expect(sendStack.length).toBe(1);
			expect(sendStack[0]).toBe(makeText('Ingresa valores'));
			expect(returned).toBe(makeText('Ingresa valores'));
		},
	},
	{
		file: 6,
		label: 'Varias Entradas de Usuario II',
		expect: Results.SUCCESS,
		args: [ 'nwn', 'verdadero', '42', 'tiraba esa', '1', '2', '3', '4' ],
		log,
		test: function({ inputStack, sendStack, returned }) {
			expect(inputStack.length).toBe(5);

			/**@type {(a: Input, b: Input) => boolean}*/
			const compareInputs = (input, otherInput) => input.equals(otherInput);
			expect(inputStack[0]).toDo(i => compareInputs(i, new Input('a', 'Text', false)));
			expect(inputStack[1]).toDo(i => compareInputs(i, new Input('b', 'Boolean', true)));
			expect(inputStack[2]).toDo(i => compareInputs(i, new Input('c', 'Number', false)));
			expect(inputStack[3]).toDo(i => compareInputs(i, new Input('d', 'Text', true)));
			expect(inputStack[4]).toDo(i => compareInputs(i, new Input('e', 'Number', false)));
			expect(inputStack[4].spread).toBe(true);

			expect(sendStack.length).toBe(5);
			expect(sendStack[0]).toBe(makeNumber(1));
			expect(sendStack[1]).toBe(makeNumber(2));
			expect(sendStack[2]).toBe(makeNumber(3));
			expect(sendStack[3]).toBe(makeNumber(4));
			expect(sendStack[4]).toBe(makeText('Bien'));

			expect(returned.kind).toBe(ValueKinds.LIST);
			let inferredList = /**@type {import('../src/interpreter/values.js').ListValue}*/(returned);
			expect(inferredList.elements.length).toBe(4);
			expect(inferredList.elements[0]).toBe(makeText('nwn'));
			expect(inferredList.elements[1]).toBe(makeBoolean(true));
			expect(inferredList.elements[2]).toBe(makeNumber(42));
			expect(inferredList.elements[3]).toBe(makeText('tiraba esa'));
		},
	},
	{
		file: 7,
		label: 'Sentencias de retorno rápido',
		expect: Results.SUCCESS,
		test: function({ sendStack, returned }) {
			expect(sendStack.length).toBe(1);
			expect(sendStack[0]).toBe(makeText('holi'));
			expect(returned).toBe(makeBoolean(true));
		},
	},
	{
		file: 8,
		label: 'Estructuras de control',
		expect: Results.SUCCESS,
		test: function({ sendStack, returned }) {
			expect(returned).toBe(makeText('🥺'));
		},
	},
	{
		file: 9,
		label: 'Estructuras iterativas',
		expect: Results.SUCCESS,
		test: untested,
	},
	{
		file: 10,
		label: 'EJECUTAR + expresiones de flecha y llamado',
		expect: Results.SUCCESS,
		skipInterpreter,
		test: untested,
	},
	{
		file: 11,
		label: 'Expresión de función',
		expect: Results.SUCCESS,
		test: untested,
	},
	{
		file: 12,
		label: 'Casteos Primitivos de expresiones',
		expect: Results.SUCCESS,
		test: untested,
	},
	{
		file: 13,
		label: 'Funciones nativas',
		expect: Results.SUCCESS,
		test: untested,
	},
	{
		file: 14,
		label: 'Métodos nativos',
		expect: Results.SUCCESS,
		test: untested,
	},
	{
		file: 15,
		label: 'Secuencias y Lambdas',
		expect: Results.SUCCESS,
		test: untested,
	},
	{
		file: 16,
		label: 'Creación, modificación y envío de Marco',
		expect: Results.SUCCESS,
		test: untested,
	},
	{
		file: 17,
		label: 'Funciones impuras',
		expect: Results.SUCCESS,
		test: untested,
	},
	{
		file: 18,
		label: 'Retorno de Funciones y Ámbito de Función',
		expect: Results.SUCCESS,
		test: untested,
	},
	{
		file: 19,
		label: 'Recursividad',
		expect: Results.SUCCESS,
		test: untested,
	},
	{
		file: 20,
		label: 'Guardar y Cargar',
		expect: Results.SUCCESS,
		test: untested,
	},
	{
		file: 21,
		label: 'Daño de Risko',
		expect: Results.SUCCESS,
		skipInterpreter,
		test: untested,
	},
	{
		file: 22,
		label: 'Guardar y Cargar Listas',
		expect: Results.SUCCESS,
		test: untested,
	},
	{
		file: 23,
		label: 'Error con Entradas Extensivas',
		expect: Results.FAILURE,
		test: untested,
	},
	{
		file: 24,
		label: 'Juego de Bomba',
		expect: Results.SUCCESS,
		test: untested,
	},
	{
		file: 25,
		label: 'Guardado Inválido de Marco',
		expect: Results.FAILURE,
		test: untested,
	},
	{
		file: 26,
		label: 'Formatos de Entrada',
		expect: Results.SUCCESS,
		args: [ '2', 'POLLA', 'si' ],
		test: function({ sendStack }) {
			expect(sendStack[0]).toBe(makeNumber(10));
			expect(sendStack[1]).toBe(makeText('polla'));
			expect(sendStack[2]).toBe(makeBoolean(true));
		},
	},
	{
		file: 27,
		label: 'Terraria',
		expect: Results.SUCCESS,
		test: untested,
	},
	{
		file: 28,
		label: 'Predicados',
		expect: Results.SUCCESS,
		test: untested,
	},
	{
		file: 29,
		label: 'Formateo de Números',
		expect: Results.SUCCESS,
		test: untested,
	},
	{
		file: 30,
		label: 'Mismo identificador en Funciones',
		expect: Results.SUCCESS,
		test: untested,
	},
];

const pass = [];
const fail = [];
//#endregion

//#region Proceso de Testing
const fullPath = path.join(relPath, filenamePrefix)
const testFile = (/**@type {number}*/ n) => `${fullPath}${n}${filenamePostfix}`;

const lexer = new Lexer();
const parser = new Parser();
const interpreter = new Interpreter();

const testStrings = [];
for(const test of tests)
	testStrings.push(readFileSync(testFile(test.file), { encoding: 'utf-8' }));

async function testScripts() {
	console.time('Todos los Tests');
	for(const test of tests) {
		const purescript = testStrings.shift();
		
		if(test.log)
			console.time(test.label);
		
		try {
			const tokens = lexer.tokenize(purescript);
			if(test.log)
				console.table(tokens.map(token => ({ ...token.json, value: (typeof token.value === 'string') ? shortenText(token.value, 32, '[...]') : token.value })));
			
			const tree = parser.parse(tokens);
			if(test.log) {
				console.log(chalk.bold('\nÁrbol:'));
				console.log(stringifyPSAST(tree, 3));
			}
			
			if(!test.skipInterpreter) {
				const scope = new Scope(interpreter);
				const provider = new TestEnvironmentProvider();
				declareNatives(scope);
				await declareContext(scope, provider);
				const isTestDrive = (test.args == null);
				const args = test.args ?? [];
				
				const result = interpreter.evaluateProgram(tree, scope, purescript, provider, args, isTestDrive);
				if(test.log) {
					console.log(chalk.bold('\nResultado:'));
					console.log(stringifyPSAST(result));
				}

				test.test(result);
			}
			
			if(test.expect === Results.SUCCESS)
				pass.push(test);
			else
				fail.push(test);
		} catch(err) {
			const logError = () => {
				console.log(chalk.red(err.name ?? 'Error desconocido'));
				console.error(err);
			};
	
			if(test.expect === Results.FAILURE) {
				if(test.log) logError();
				test.error = shortenText(err.message, 96);
				pass.push(test);
			} else {
				logError();
				test.error = err.message;
				fail.push(test);
			}
		}
		if(test.log)
			console.timeEnd(test.label);
	}
	console.timeEnd('Todos los Tests');
	
	const sep = '-'.repeat(119);
	
	console.log(sep);
	
	for(const test of pass)
		console.log(`${chalk.bgGreenBright(' PASS ')} ${chalk.cyan(test.file)} ${chalk.gray(test.expect === Results.SUCCESS ? 'Lograr' : 'Fallar')} ${chalk.greenBright(test.label)}${test.expect === Results.SUCCESS ? '' : ` - ${chalk.gray(test.error)}`}`);
	
	for(const test of fail)
		console.log(`${chalk.bgRedBright(' FAIL ')} ${chalk.cyan(test.file)} ${chalk.gray(test.expect === Results.SUCCESS ? 'Lograr' : 'Fallar')} ${chalk.yellow(test.label)} - ${test.expect === Results.SUCCESS ? chalk.gray(test.error) : 'La prueba se ejecutó sin arrojar errores'}`);
	
	console.log(sep);
}
testScripts();
//#endregion
