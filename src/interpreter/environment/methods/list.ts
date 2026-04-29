/** biome-ignore-all lint/correctness/noEmptyPattern: Explicitly stating that all these functions take an array of args. */

import { randRange } from '../../../util/utils';
import {
	type BooleanValue,
	coerceValue,
	type FunctionValue,
	isInternalNull,
	type ListValue,
	makeBoolean,
	makeList,
	makeNada,
	makeNumber,
	makeRegistry,
	makeText,
	type NadaValue,
	type NativeFunction,
	type NumberValue,
	type RegistryValue,
	type RuntimeValue,
	type TextValue,
	ValueKinds,
} from '../../values';
import {
	ensureMethod,
	expectParam,
	getParamOrDefault,
	getParamOrNada,
	makePredicateFn,
	type OptionalArg,
} from '../nativeUtils';
import type { MapOfMethodCompilers } from './types';

export type ListMethod<
	TArg extends RuntimeValue[] = RuntimeValue[],
	TResult extends RuntimeValue = RuntimeValue,
> = NativeFunction<ListValue, TArg, TResult>;

const listaAInvertido: ListMethod<[], ListValue> = (self, []) => {
	return makeList(self.elements.toReversed());
};

const listaAlguno: ListMethod<[FunctionValue], BooleanValue> = (self, [predicado], scope) => {
	const fn = makePredicateFn('predicado', predicado, scope);
	const test = self.elements.some(
		(el, i) =>
			coerceValue(scope.interpreter, fn(el, makeNumber(i), self), ValueKinds.BOOLEAN).value,
	);
	return makeBoolean(test);
};

const listaAOrdenada: ListMethod<[OptionalArg<FunctionValue>], ListValue> = (
	self,
	[criterio],
	scope,
) => {
	if (isInternalNull(criterio))
		return makeList(self.elements.toSorted((a, b) => a.compareTo(b).value));

	const fn = makePredicateFn('criterio', criterio, scope);
	const processedElements = self.elements.toSorted(
		(a, b) => coerceValue(scope.interpreter, fn(a, b), ValueKinds.NUMBER).value,
	);
	return makeList(processedElements);
};

const listaARegistro: ListMethod<[], RegistryValue> = (self, []) => {
	const entries = new Map(self.elements.map((el, i) => [`${i}`, el]));
	return makeRegistry(entries);
};

const listaContiene: ListMethod<[RuntimeValue], BooleanValue> = (self, [x]) => {
	const test = self.elements.some((el) => el.equals(x));
	return makeBoolean(test);
};

const listaCortar: ListMethod<[OptionalArg<NumberValue>, OptionalArg<NumberValue>], ListValue> = (
	self,
	[inicio, fin],
	scope,
) => {
	const [inicioExists, inicioResult] = getParamOrNada('inicio', inicio, ValueKinds.NUMBER, scope);
	if (!inicioExists) return self;

	const [finExists, finResult] = getParamOrNada('fin', fin, ValueKinds.NUMBER, scope);
	if (!finExists) return makeList(self.elements.slice(inicioResult.value));

	return makeList(self.elements.slice(inicioResult.value, finResult.value));
};

const listaElegir: ListMethod<[OptionalArg<NumberValue>, OptionalArg<NumberValue>]> = (
	self,
	[mínimo, máximo],
	scope,
) => {
	const mínimoResult = getParamOrDefault('mínimo', mínimo, ValueKinds.NUMBER, scope, 0);
	const máximoResult = getParamOrDefault(
		'máximo',
		máximo,
		ValueKinds.NUMBER,
		scope,
		self.elements.length,
	);

	return self.elements[randRange(mínimoResult.value, máximoResult.value, true)];
};

const listaEncontrar: ListMethod<[FunctionValue]> = (self, [predicado], scope) => {
	const fn = makePredicateFn('predicado', predicado, scope);
	const element =
		self.elements.find(
			(el, i) =>
				coerceValue(scope.interpreter, fn(el, makeNumber(i), self), ValueKinds.BOOLEAN)
					.value,
		) ?? makeNada();
	return element;
};

const listaEncontrarÚltimo: ListMethod<[FunctionValue]> = (self, [predicado], scope) => {
	const fn = makePredicateFn('predicado', predicado, scope);
	const element =
		self.elements.findLast(
			(el, i) =>
				coerceValue(scope.interpreter, fn(el, makeNumber(i), self), ValueKinds.BOOLEAN)
					.value,
		) ?? makeNada();
	return element;
};

const listaEncontrarId: ListMethod<[FunctionValue], NumberValue> = (self, [predicado], scope) => {
	const fn = makePredicateFn('predicado', predicado, scope);
	const idx = self.elements.findIndex(
		(el, i) =>
			coerceValue(scope.interpreter, fn(el, makeNumber(i), self), ValueKinds.BOOLEAN).value,
	);
	return makeNumber(idx);
};

const listaEncontrarÚltimoId: ListMethod<[FunctionValue], NumberValue> = (
	self,
	[predicado],
	scope,
) => {
	const fn = makePredicateFn('predicado', predicado, scope);
	const idx = self.elements.findLastIndex(
		(el, i) =>
			coerceValue(scope.interpreter, fn(el, makeNumber(i), self), ValueKinds.BOOLEAN).value,
	);
	return makeNumber(idx);
};

const listaFiltrar: ListMethod<[FunctionValue], ListValue> = (self, [filtro], scope) => {
	const fn = makePredicateFn('filtro', filtro, scope);
	const processedElements = self.elements.filter(
		(el, i) =>
			coerceValue(scope.interpreter, fn(el, makeNumber(i), self), ValueKinds.BOOLEAN).value,
	);
	return makeList(processedElements);
};

const listaInvertir: ListMethod<[], NadaValue> = (self, []) => {
	self.elements.reverse();
	return makeNada();
};

const listaMapear: ListMethod<[FunctionValue], ListValue> = (self, [mapeo], scope) => {
	const fn = makePredicateFn('mapeo', mapeo, scope);
	const processedElements = self.elements.map((el, i) => fn(el, makeNumber(i), self));
	return makeList(processedElements);
};

const listaOrdenar: ListMethod<[OptionalArg<FunctionValue>], NadaValue> = (
	self,
	[criterio],
	scope,
) => {
	if (isInternalNull(criterio)) {
		self.elements.sort((a, b) => a.compareTo(b).value);
	} else {
		const fn = makePredicateFn('criterio', criterio, scope);
		self.elements.sort(
			(a, b) => coerceValue(scope.interpreter, fn(a, b), ValueKinds.NUMBER).value,
		);
	}

	return makeNada();
};

const listaParaCada: ListMethod<[FunctionValue], NadaValue> = (self, [procedimiento], scope) => {
	const fn = makePredicateFn('procedimiento', procedimiento, scope);
	self.elements.slice().forEach((el, i) => fn(el, makeNumber(i), self));
	return makeNada();
};

const listaRobar: ListMethod<[NumberValue]> = (self, [índice], scope) => {
	const índiceResult = expectParam('índice', índice, ValueKinds.NUMBER, scope);

	if (índiceResult.value < 0 || índiceResult.value >= self.elements.length) return makeNada();

	const removed = self.elements.splice(índiceResult.value, 1);
	if (!removed.length || removed[0] == null) return makeNada();

	return removed[0];
};

const listaRobarPrimero: ListMethod<[]> = (self, []) => {
	return self.elements.shift() ?? makeNada();
};

const listaRobarÚltimo: ListMethod<[]> = (self, []) => {
	return self.elements.pop() ?? makeNada();
};

const listaTodos: ListMethod<[FunctionValue], BooleanValue> = (self, [predicado], scope) => {
	const fn = makePredicateFn('predicado', predicado, scope);
	const test = self.elements.every(
		(el, i) =>
			coerceValue(scope.interpreter, fn(el, makeNumber(i), self), ValueKinds.BOOLEAN).value,
	);
	return makeBoolean(test);
};

const listaUnir: ListMethod<[TextValue], TextValue> = (self, [separador], scope) => {
	if (!self.elements.length) return makeText('');

	const separadorResult = getParamOrDefault('separador', separador, ValueKinds.TEXT, scope, ',');
	const elementTextValues = self.elements.map(
		(el) => coerceValue(scope.interpreter, el, ValueKinds.TEXT).value,
	);
	return makeText(elementTextValues.join(separadorResult.value));
};

const listaÚltimo: ListMethod<[]> = (self, []) => {
	return self.elements[self.elements.length];
};

const listaVacía: ListMethod<[], BooleanValue> = (self, []) => {
	return makeBoolean(self.elements.length === 0);
};

export const listMethods: MapOfMethodCompilers<ListValue> = new Map();
listMethods
	.set('aleatorio', (it) => ensureMethod(it).opt('Number').opt('Number').appliesTo(listaElegir))
	.set('aInvertida', (it) => ensureMethod(it).appliesTo(listaAInvertido))
	.set('aInvertido', (it) => ensureMethod(it).appliesTo(listaAInvertido))
	.set('algun', (it) => ensureMethod(it).arg('Function').appliesTo(listaAlguno))
	.set('algún', (it) => ensureMethod(it).arg('Function').appliesTo(listaAlguno))
	.set('alguno', (it) => ensureMethod(it).arg('Function').appliesTo(listaAlguno))
	.set('aOrdenada', (it) => ensureMethod(it).opt('Function').appliesTo(listaAOrdenada))
	.set('aOrdenado', (it) => ensureMethod(it).opt('Function').appliesTo(listaAOrdenada))
	.set('aRegistro', (it) => ensureMethod(it).appliesTo(listaARegistro))
	.set('contiene', (it) => ensureMethod(it).arg().appliesTo(listaContiene))
	.set('cortar', (it) => ensureMethod(it).opt('Number').opt('Number').appliesTo(listaCortar))
	.set('elegir', (it) => ensureMethod(it).opt('Number').opt('Number').appliesTo(listaElegir))
	.set('encontrar', (it) => ensureMethod(it).arg('Function').appliesTo(listaEncontrar))
	.set('encontrarId', (it) => ensureMethod(it).arg('Function').appliesTo(listaEncontrarId))
	.set('encontrarUltimaId', (it) =>
		ensureMethod(it).arg('Function').appliesTo(listaEncontrarÚltimoId),
	)
	.set('encontrarÚltimaId', (it) =>
		ensureMethod(it).arg('Function').appliesTo(listaEncontrarÚltimoId),
	)
	.set('encontrarUltimoId', (it) =>
		ensureMethod(it).arg('Function').appliesTo(listaEncontrarÚltimoId),
	)
	.set('encontrarÚltimoId', (it) =>
		ensureMethod(it).arg('Function').appliesTo(listaEncontrarÚltimoId),
	)
	.set('encontrarUltimo', (it) =>
		ensureMethod(it).arg('Function').appliesTo(listaEncontrarÚltimo),
	)
	.set('encontrarÚltimo', (it) =>
		ensureMethod(it).arg('Function').appliesTo(listaEncontrarÚltimo),
	)
	.set('escoger', (it) => ensureMethod(it).opt('Number').opt('Number').appliesTo(listaElegir))
	.set('filtrar', (it) => ensureMethod(it).arg('Function').appliesTo(listaFiltrar))
	.set('incluye', (it) => ensureMethod(it).arg().appliesTo(listaContiene))
	.set('invertir', (it) => ensureMethod(it).appliesTo(listaInvertir))
	.set('mapear', (it) => ensureMethod(it).arg('Function').appliesTo(listaMapear))
	.set('ordenar', (it) => ensureMethod(it).opt('Function').appliesTo(listaOrdenar))
	.set('ordenada', (it) => ensureMethod(it).opt('Function').appliesTo(listaAOrdenada))
	.set('ordenado', (it) => ensureMethod(it).opt('Function').appliesTo(listaAOrdenada))
	.set('paraCada', (it) => ensureMethod(it).arg('Function').appliesTo(listaParaCada))
	.set('robar', (it) => ensureMethod(it).arg('Number').appliesTo(listaRobar))
	.set('robarPrimero', (it) => ensureMethod(it).appliesTo(listaRobarPrimero))
	.set('robarUltimo', (it) => ensureMethod(it).appliesTo(listaRobarÚltimo))
	.set('robarÚltimo', (it) => ensureMethod(it).appliesTo(listaRobarÚltimo))
	.set('todos', (it) => ensureMethod(it).arg('Function').appliesTo(listaTodos))
	.set('unir', (it) => ensureMethod(it).arg('Text').appliesTo(listaUnir))
	.set('ultimo', (it) => ensureMethod(it).appliesTo(listaÚltimo))
	.set('último', (it) => ensureMethod(it).appliesTo(listaÚltimo))
	.set('vacia', (it) => ensureMethod(it).appliesTo(listaVacía))
	.set('vacía', (it) => ensureMethod(it).appliesTo(listaVacía));
