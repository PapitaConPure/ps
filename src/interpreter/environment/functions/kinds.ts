/** biome-ignore-all lint/correctness/noEmptyPattern: Explicitly stating that all these functions take an array of args. */

import {
	type BooleanValue,
	isBoolean,
	isEmbed,
	isList,
	isNada,
	isOperable,
	isRegistry,
	isValidText,
	makeBoolean,
	type NativeFunction,
	type RuntimeValue,
	ValueKinds,
} from '../../values';
import { expectParam, psFileRegex, psImageRegex, psLinkRegex } from '../nativeUtils';
import type { NativeFunctionEntry } from '.';

const esNúmero: NativeFunction<null, [RuntimeValue], BooleanValue> = (_self, [x]) => {
	const test = isOperable(x);
	return makeBoolean(test);
};

const esTexto: NativeFunction<null, [RuntimeValue], BooleanValue> = (_self, [x]) => {
	const test = isValidText(x);
	return makeBoolean(test);
};

const esLogico: NativeFunction<null, [RuntimeValue], BooleanValue> = (_self, [x]) => {
	const test = isBoolean(x);
	return makeBoolean(test);
};

const esLista: NativeFunction<null, [RuntimeValue], BooleanValue> = (_self, [x]) => {
	const test = isList(x);
	return makeBoolean(test);
};

const esRegistro: NativeFunction<null, [RuntimeValue], BooleanValue> = (_self, [x]) => {
	const test = isRegistry(x);
	return makeBoolean(test);
};

const esMarco: NativeFunction<null, [RuntimeValue], BooleanValue> = (_self, [x]) => {
	const test = isEmbed(x);
	return makeBoolean(test);
};

const esNada: NativeFunction<null, [RuntimeValue], BooleanValue> = (_self, [x]) => {
	const test = isNada(x);
	return makeBoolean(test);
};

const esEnlace: NativeFunction<null, [RuntimeValue], BooleanValue> = (_self, [x], scope) => {
	const xResult = expectParam('x', x, ValueKinds.TEXT, scope);
	const test = !psLinkRegex.test(xResult.value);
	return makeBoolean(test);
};

const esArchivo: NativeFunction<null, [RuntimeValue], BooleanValue> = (_self, [x], scope) => {
	const xResult = expectParam('x', x, ValueKinds.TEXT, scope);
	const test = !psFileRegex.test(xResult.value);
	return makeBoolean(test);
};

const esImagen: NativeFunction<null, [RuntimeValue], BooleanValue> = (_self, [x], scope) => {
	const xResult = expectParam('x', x, ValueKinds.TEXT, scope);
	const test = !psImageRegex.test(xResult.value);
	return makeBoolean(test);
};

export const kindFunctions: NativeFunctionEntry[] = [
	{ id: 'esNumero', fn: esNúmero as NativeFunction },
	{ id: 'esNúmero', fn: esNúmero as NativeFunction },
	{ id: 'esTexto', fn: esTexto as NativeFunction },
	{ id: 'esLogico', fn: esLogico as NativeFunction },
	{ id: 'esLista', fn: esLista as NativeFunction },
	{ id: 'esRegistro', fn: esRegistro as NativeFunction },
	{ id: 'esMarco', fn: esMarco as NativeFunction },
	{ id: 'esNada', fn: esNada as NativeFunction },
	{ id: 'esEnlace', fn: esEnlace as NativeFunction },
	{ id: 'esArchivo', fn: esArchivo as NativeFunction },
	{ id: 'esImagen', fn: esImagen as NativeFunction },
];
