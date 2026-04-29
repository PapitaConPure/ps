/** biome-ignore-all lint/correctness/noEmptyPattern: Explicitly stating that all these functions take an array of args. */

import { clamp, improveNumber } from '../../../util/utils';
import {
	type BooleanValue,
	makeNumber,
	makeText,
	type NativeFunction,
	type NumberValue,
	type RuntimeValue,
	type TextValue,
	ValueKinds,
} from '../../values';
import { ensureMethod, expectParam, getParamOrDefault, type OptionalArg } from '../nativeUtils';
import type { MapOfMethodCompilers } from './types';

export type NumberMethod<
	TArg extends RuntimeValue[] = RuntimeValue[],
	TResult extends RuntimeValue = RuntimeValue,
> = NativeFunction<NumberValue, TArg, TResult>;

const numAbsoluto: NumberMethod<[], NumberValue> = (self, []) => {
	return makeNumber(Math.abs(self.value));
};

const numAEntero: NumberMethod<[], NumberValue> = (self, []) => {
	return makeNumber(Math.trunc(self.value));
};

const numAFijo: NumberMethod<[NumberValue], TextValue> = (self, [precisión], scope) => {
	const precisiónResult = expectParam('precisión', precisión, ValueKinds.NUMBER, scope);

	if (precisiónResult.value < 0 || precisiónResult.value > 100)
		throw scope.interpreter.TuberInterpreterError(
			'La precisión especificada debe ser un Número entre 1 y 100',
		);

	const text = self.value.toFixed(precisiónResult.value);
	return makeText(text);
};

const numAPrecisión: NumberMethod<[NumberValue], TextValue> = (self, [precisión], scope) => {
	const precisiónResult = expectParam('precisión', precisión, ValueKinds.NUMBER, scope);

	if (precisiónResult.value < 0 || precisiónResult.value > 100)
		throw scope.interpreter.TuberInterpreterError(
			'La precisión especificada debe ser un Número entre 0 y 100',
		);

	const text = (+self.value.toFixed(precisiónResult.value)).toString();
	return makeText(text);
};

const numATexto: NumberMethod<[OptionalArg<NumberValue>], TextValue> = (self, [base], scope) => {
	const baseResult = getParamOrDefault('base', base, ValueKinds.NUMBER, scope, 10);

	if (baseResult.value < 2 || baseResult.value > 36)
		throw scope.interpreter.TuberInterpreterError(
			'La base numérica de la conversión a Texto debe ser un Número entre 2 y 36 inclusive',
		);

	return makeText(self.value.toString(baseResult.value));
};

const numFormatear: NumberMethod<[BooleanValue, NumberValue], TextValue> = (
	self,
	[acortar, mínimoDígitos],
	scope,
) => {
	const acortarResult = expectParam('acortar', acortar, ValueKinds.BOOLEAN, scope);
	const mínimoResult = expectParam('mínimoDígitos', mínimoDígitos, ValueKinds.NUMBER, scope);
	if (mínimoResult.value < 1 || mínimoResult.value > 10)
		throw scope.interpreter.TuberInterpreterError(
			`El parámetro requerido \`mínimoDígitos\` debe ser un Número entre 1 y 10`,
		);

	return makeText(`${improveNumber(self.value, acortarResult.value, mínimoResult.value)}`);
};

const numLimitar: NumberMethod<[BooleanValue, NumberValue], NumberValue> = (
	self,
	[mínimo, máximo],
	scope,
) => {
	const mínimoValue = expectParam('mínimo', mínimo, ValueKinds.NUMBER, scope).value;
	const máximoValue = expectParam('máximo', máximo, ValueKinds.NUMBER, scope).value;

	const clamped = clamp(self.value, mínimoValue, máximoValue);
	return makeNumber(clamped);
};

const numSigno: NumberMethod<[], NumberValue> = (self, []) => {
	return makeNumber(Math.sign(self.value));
};

const numSuelo: NumberMethod<[], NumberValue> = (self, []) => {
	return makeNumber(Math.floor(self.value));
};

const numTecho: NumberMethod<[], NumberValue> = (self, []) => {
	return makeNumber(Math.ceil(self.value));
};

const numRedondear: NumberMethod<[], NumberValue> = (self, []) => {
	return makeNumber(Math.round(self.value));
};

export const numberMethods: MapOfMethodCompilers<NumberValue> = new Map();
numberMethods
	.set('absoluto', (it) => ensureMethod(it).appliesTo(numAbsoluto))
	.set('aEntero', (it) => ensureMethod(it).appliesTo(numAEntero))
	.set('aFijo', (it) => ensureMethod(it).arg('Number').appliesTo(numAFijo))
	.set('aFormateado', (it) =>
		ensureMethod(it).arg('Boolean').arg('Number').appliesTo(numFormatear),
	)
	.set('aPrecision', (it) => ensureMethod(it).arg('Number').appliesTo(numAPrecisión))
	.set('aPrecisión', (it) => ensureMethod(it).arg('Number').appliesTo(numAPrecisión))
	.set('aRedondeado', (it) => ensureMethod(it).appliesTo(numRedondear))
	.set('aTexto', (it) => ensureMethod(it).opt('Number').appliesTo(numATexto))
	.set('aTruncado', (it) => ensureMethod(it).appliesTo(numAEntero))
	.set('entero', (it) => ensureMethod(it).appliesTo(numAEntero))
	.set('formatear', (it) => ensureMethod(it).arg('Boolean').arg('Number').appliesTo(numFormatear))
	.set('limitar', (it) => ensureMethod(it).arg('Boolean').arg('Number').appliesTo(numLimitar))
	.set('redondear', (it) => ensureMethod(it).appliesTo(numRedondear))
	.set('signo', (it) => ensureMethod(it).appliesTo(numSigno))
	.set('suelo', (it) => ensureMethod(it).appliesTo(numSuelo))
	.set('techo', (it) => ensureMethod(it).appliesTo(numTecho))
	.set('truncar', (it) => ensureMethod(it).appliesTo(numAEntero));
