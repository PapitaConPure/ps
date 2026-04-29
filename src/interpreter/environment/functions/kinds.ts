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
import { ensureFn, expectParam, psFileRegex, psImageRegex, psLinkRegex } from '../nativeUtils';
import type { NativeFunctionEntry } from './types';

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
	{ id: 'esNumero', fn: (it) => ensureFn(it).opt().appliesTo(esNúmero) },
	{ id: 'esNúmero', fn: (it) => ensureFn(it).opt().appliesTo(esNúmero) },
	{ id: 'esTexto', fn: (it) => ensureFn(it).opt().appliesTo(esTexto) },
	{ id: 'esLogico', fn: (it) => ensureFn(it).opt().appliesTo(esLogico) },
	{ id: 'esLista', fn: (it) => ensureFn(it).opt().appliesTo(esLista) },
	{ id: 'esRegistro', fn: (it) => ensureFn(it).opt().appliesTo(esRegistro) },
	{ id: 'esMarco', fn: (it) => ensureFn(it).opt().appliesTo(esMarco) },
	{ id: 'esNada', fn: (it) => ensureFn(it).opt().appliesTo(esNada) },
	{ id: 'esEnlace', fn: (it) => ensureFn(it).opt().appliesTo(esEnlace) },
	{ id: 'esArchivo', fn: (it) => ensureFn(it).opt().appliesTo(esArchivo) },
	{ id: 'esImagen', fn: (it) => ensureFn(it).opt().appliesTo(esImagen) },
];
