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
import { expectParam, getParamOrDefault } from '../nativeUtils';

export type NumberMethod<
	TArg extends RuntimeValue[] = RuntimeValue[],
	TResult extends RuntimeValue = RuntimeValue,
> = NativeFunction<NumberValue, TArg, TResult>;

const númeroAbsoluto: NumberMethod<[], NumberValue> = (self, []) => {
	return makeNumber(Math.abs(self.value));
};

const númeroAEntero: NumberMethod<[], NumberValue> = (self, []) => {
	return makeNumber(Math.trunc(self.value));
};

const númeroAFijo: NumberMethod<[NumberValue], TextValue> = (self, [precisión], scope) => {
	const precisiónResult = expectParam('precisión', precisión, ValueKinds.NUMBER, scope);

	if (precisiónResult.value < 0 || precisiónResult.value > 100)
		throw scope.interpreter.TuberInterpreterError(
			'La precisión especificada debe ser un Número entre 1 y 100',
		);

	const text = self.value.toFixed(precisiónResult.value);
	return makeText(text);
};

const númeroAPrecisión: NumberMethod<[NumberValue], TextValue> = (self, [precisión], scope) => {
	const precisiónResult = expectParam('precisión', precisión, ValueKinds.NUMBER, scope);

	if (precisiónResult.value < 0 || precisiónResult.value > 100)
		throw scope.interpreter.TuberInterpreterError(
			'La precisión especificada debe ser un Número entre 0 y 100',
		);

	const text = (+self.value.toFixed(precisiónResult.value)).toString();
	return makeText(text);
};

const númeroATexto: NumberMethod<[NumberValue], TextValue> = (self, [base], scope) => {
	const baseResult = getParamOrDefault('base', base, ValueKinds.NUMBER, scope, 10);

	if (baseResult.value < 2 || baseResult.value > 36)
		throw scope.interpreter.TuberInterpreterError(
			'La base numérica de la conversión a Texto debe ser un Número entre 2 y 36 inclusive',
		);

	return makeText(self.value.toString(baseResult.value));
};

const númeroFormatear: NumberMethod<[BooleanValue, NumberValue], TextValue> = (
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

const númeroLimitar: NumberMethod<[BooleanValue, NumberValue], NumberValue> = (
	self,
	[mínimo, máximo],
	scope,
) => {
	const mínimoValue = expectParam('mínimo', mínimo, ValueKinds.NUMBER, scope).value;
	const máximoValue = expectParam('máximo', máximo, ValueKinds.NUMBER, scope).value;

	const clamped = clamp(self.value, mínimoValue, máximoValue);
	return makeNumber(clamped);
};

const númeroSigno: NumberMethod<[], NumberValue> = (self, []) => {
	return makeNumber(Math.sign(self.value));
};

const númeroSuelo: NumberMethod<[], NumberValue> = (self, []) => {
	return makeNumber(Math.floor(self.value));
};

const númeroTecho: NumberMethod<[], NumberValue> = (self, []) => {
	return makeNumber(Math.ceil(self.value));
};

const númeroRedondear: NumberMethod<[], NumberValue> = (self, []) => {
	return makeNumber(Math.round(self.value));
};

export const numberMethods = new Map<string, NumberMethod>()
	.set('absoluto', númeroAbsoluto as NumberMethod)
	.set('aEntero', númeroAEntero as NumberMethod)
	.set('aFijo', númeroAFijo as NumberMethod)
	.set('aFormateado', númeroFormatear as NumberMethod)
	.set('aPrecision', númeroAPrecisión as NumberMethod)
	.set('aPrecisión', númeroAPrecisión as NumberMethod)
	.set('aRedondeado', númeroRedondear as NumberMethod)
	.set('aTexto', númeroATexto as NumberMethod)
	.set('aTruncado', númeroAEntero as NumberMethod)
	.set('entero', númeroAEntero as NumberMethod)
	.set('formatear', númeroFormatear as NumberMethod)
	.set('limitar', númeroLimitar as NumberMethod)
	.set('redondear', númeroRedondear as NumberMethod)
	.set('signo', númeroSigno as NumberMethod)
	.set('suelo', númeroSuelo as NumberMethod)
	.set('techo', númeroTecho as NumberMethod)
	.set('truncar', númeroAEntero as NumberMethod);
