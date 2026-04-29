/** biome-ignore-all lint/correctness/noEmptyPattern: Explicitly stating that all these functions take an array of args. */

import {
	type BooleanValue,
	coerceValue,
	type FunctionValue,
	type ListValue,
	makeBoolean,
	makeList,
	makeNada,
	makeRegistry,
	makeText,
	type NadaValue,
	type NativeFunction,
	type RegistryValue,
	type RuntimeValue,
	type TextValue,
	ValueKinds,
} from '../../values';
import { expectParam, makePredicateFn } from '../nativeUtils';

export type RegistryMethod<
	TArg extends RuntimeValue[] = RuntimeValue[],
	TResult extends RuntimeValue = RuntimeValue,
> = NativeFunction<RegistryValue, TArg, TResult>;

const registroClaves: RegistryMethod<[], ListValue> = (self, []) => {
	const keysArray = [...self.entries.keys()];
	const keyRVals = keysArray.map((key) => makeText(key));
	return makeList(keyRVals);
};

const registroContiene: RegistryMethod<[TextValue], BooleanValue> = (self, [clave], scope) => {
	const claveResult = expectParam('clave', clave, ValueKinds.TEXT, scope);
	return makeBoolean(self.entries.has(claveResult.value));
};

const registroEntradas: RegistryMethod<[], ListValue> = (self, []) => {
	const entriesArray = [...self.entries.entries()];
	const entriesRVal = entriesArray.map(([k, v]) => makeList([makeText(k), v]));
	return makeList(entriesRVal);
};

const registroFiltrar: RegistryMethod<[FunctionValue], RegistryValue> = (
	self,
	[predicado],
	scope,
) => {
	const fn = makePredicateFn('filtro', predicado, scope);

	const filtered = new Map<string, RuntimeValue>();
	for (const [key, value] of self.entries) {
		const test = coerceValue(scope.interpreter, fn(makeText(key), value), ValueKinds.BOOLEAN);
		if (test.value) filtered.set(key, value);
	}

	return makeRegistry(filtered);
};

const registroParaCada: RegistryMethod<[FunctionValue], NadaValue> = (self, [predicado], scope) => {
	const fn = makePredicateFn('procedimiento', predicado, scope);

	const entries = new Map(self.entries);
	for (const [key, value] of entries) fn(makeText(key), value);

	return makeNada();
};

const registroQuitar: RegistryMethod<[TextValue], BooleanValue> = (self, [clave], scope) => {
	const claveResult = expectParam('clave', clave, ValueKinds.TEXT, scope);
	const deleted = self.entries.delete(claveResult.value);
	return makeBoolean(deleted);
};

const registroVacío: RegistryMethod<[], BooleanValue> = (self, []) => {
	return makeBoolean(self.entries.size === 0);
};

const registroValores: RegistryMethod<[], ListValue> = (self, []) => {
	const valuesArray = [...self.entries.values()];
	return makeList(valuesArray);
};

export const registryMethods = new Map<string, RegistryMethod>()
	.set('claves', registroClaves as RegistryMethod)
	.set('contiene', registroContiene as RegistryMethod)
	.set('entradas', registroEntradas as RegistryMethod)
	.set('filtrar', registroFiltrar as RegistryMethod)
	.set('paraCada', registroParaCada as RegistryMethod)
	.set('quitar', registroQuitar as RegistryMethod)
	.set('vacio', registroVacío as RegistryMethod)
	.set('vacío', registroVacío as RegistryMethod)
	.set('valores', registroValores as RegistryMethod);
