import { ProgramStatement } from '../../src/ast/statements';
import { RuntimeValue } from '../../src/interpreter/values';
import { Lexer, Parser, Interpreter, Scope, declareNatives, declareContext, stringifyPSAST, Token } from '../../src';
import TestEnvironmentProvider from '../testEnvironmentProvider';
import { EvaluationResult } from '../../src/interpreter';
import { shortenText } from '../../src/util/utils';
import chalk from 'chalk';

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

export async function executePS(code: string, options: ExecutePSOptions = {}): Promise<ExecutePSResult> {
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
