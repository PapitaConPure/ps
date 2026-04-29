/** biome-ignore-all lint/correctness/noEmptyPattern: Explicitly stating that all these functions take an array of args. */

import { toLowerCaseNormalized } from '../../../util/utils';
import {
	type BooleanValue,
	isInternalOperable,
	type ListValue,
	makeBoolean,
	makeList,
	makeNada,
	makeNumber,
	makeText,
	type NadaValue,
	type NativeFunction,
	type NumberValue,
	type RuntimeValue,
	type TextValue,
	ValueKinds,
} from '../../values';
import {
	calculatePositionOffset,
	ensureMethod,
	expectParam,
	getParamOrDefault,
	type OptionalArg,
} from '../nativeUtils';
import type { MapOfMethodCompilers } from './types';

export type TextMethod<
	TArg extends RuntimeValue[] = RuntimeValue[],
	TResult extends RuntimeValue = RuntimeValue,
> = NativeFunction<TextValue, TArg, TResult>;

const textoAcotar: TextMethod<[], TextValue> = (self, []) => {
	return makeText(self.value.trim());
};

const textoALista: TextMethod<[], ListValue> = (self, []) => {
	return makeList([...self.value].map((v) => makeText(v)));
};

const textoAMayúsculas: TextMethod<[], TextValue> = (self, []) => {
	return makeText(self.value.toUpperCase());
};

const textoAMinúsculas: TextMethod<[], TextValue> = (self, []) => {
	return makeText(self.value.toLowerCase());
};

const textoCaracterEn: TextMethod<[NumberValue], TextValue | NadaValue> = (
	self,
	[posición],
	scope,
) => {
	if (
		posición == null
		|| posición.kind !== ValueKinds.NUMBER
		|| !isInternalOperable(posición.value)
	)
		throw scope.interpreter.TuberInterpreterError(
			'Se esperaba un Número válido como argumento de posición de caracter',
		);

	const pos = calculatePositionOffset(posición.value, self.value.length);
	const str = self.value.charAt(pos);
	if (str?.length) return makeText(str);

	return makeNada();
};

const textoComienzaCon: TextMethod<[TextValue], BooleanValue> = (self, [subCadena], scope) => {
	const subCadenaResult = expectParam('subCadena', subCadena, ValueKinds.TEXT, scope);
	return makeBoolean(self.value.startsWith(subCadenaResult.value));
};

const textoContiene: TextMethod<[TextValue], BooleanValue> = (self, [subCadena], scope) => {
	const subCadenaResult = expectParam('subCadena', subCadena, ValueKinds.TEXT, scope);
	return makeBoolean(self.value.includes(subCadenaResult.value));
};

const textoCortar: TextMethod<[OptionalArg<NumberValue>, OptionalArg<NumberValue>], TextValue> = (
	self,
	[inicio, fin],
	scope,
) => {
	const inicioResult = getParamOrDefault('inicio', inicio, ValueKinds.NUMBER, scope, 0);
	const finResult = getParamOrDefault('fin', fin, ValueKinds.NUMBER, scope, self.value.length);

	return makeText(self.value.slice(inicioResult.value, finResult.value));
};

const textoNormalizar: TextMethod<[], TextValue> = (self, []) => {
	return makeText(toLowerCaseNormalized(self.value.trim()));
};

const textoPartir: TextMethod<[TextValue], ListValue> = (self, [separador], scope) => {
	if (separador.kind !== ValueKinds.TEXT)
		throw scope.interpreter.TuberInterpreterError(
			'Se esperaba un Texto válido como argumento separador de Texto',
		);

	return makeList(self.value.split(separador.value).map((split) => makeText(split)));
};

const textoPosiciónDe: TextMethod<[TextValue], NumberValue> = (self, [búsqueda], scope) => {
	const búsquedaValue = expectParam('búsqueda', búsqueda, ValueKinds.TEXT, scope).value;
	return makeNumber(self.value.indexOf(búsquedaValue));
};

const textoReemplazar: TextMethod<[TextValue, TextValue], TextValue> = (
	self,
	[ocurrencia, reemplazo],
	scope,
) => {
	const ocurrenciaValue = expectParam('ocurrencia', ocurrencia, ValueKinds.TEXT, scope).value;

	if (ocurrenciaValue.length === 0)
		throw scope.interpreter.TuberInterpreterError(
			`Se esperaba un Texto no-vacío como ocurrencia de Función \`reemplazar\``,
		);

	const reemplazoValue = expectParam('reemplazo', reemplazo, ValueKinds.TEXT, scope).value;
	return makeText(self.value.replace(ocurrenciaValue, reemplazoValue));
};

const textoRepetido: TextMethod<[NumberValue], TextValue> = (self, [veces], scope) => {
	const vecesResult = expectParam('veces', veces, ValueKinds.NUMBER, scope);

	const times = Math.floor(vecesResult.value);
	if (times < 0 || times * self.value.length > 1024)
		throw scope.interpreter.TuberInterpreterError(
			'Se esperaba un Número positivo hasta 1024 como argumento de repeticiones de Texto',
		);

	return makeText(self.value.repeat(times));
};

const textoTerminaCon: TextMethod<[TextValue], BooleanValue> = (self, [texto], scope) => {
	if (texto?.kind !== ValueKinds.TEXT)
		throw scope.interpreter.TuberInterpreterError(
			'Se esperaba un Texto válido como argumento de comprobación de sub-texto',
		);

	return makeBoolean(self.value.endsWith(texto.value));
};

const textoÚltimaPosiciónDe: TextMethod<[TextValue], NumberValue> = (self, [texto], scope) => {
	if (texto.kind !== ValueKinds.TEXT)
		throw scope.interpreter.TuberInterpreterError(
			'Se esperaba un Texto válido como argumento de búsqueda de sub-texto',
		);

	return makeNumber(self.value.lastIndexOf(texto.value));
};

export const textMethods: MapOfMethodCompilers<TextValue> = new Map();
textMethods
	.set('acotar', (it) => ensureMethod(it).appliesTo(textoAcotar))
	.set('aLista', (it) => ensureMethod(it).appliesTo(textoALista))
	.set('aMinuscula', (it) => ensureMethod(it).appliesTo(textoAMinúsculas))
	.set('aMinúscula', (it) => ensureMethod(it).appliesTo(textoAMinúsculas))
	.set('aMayuscula', (it) => ensureMethod(it).appliesTo(textoAMayúsculas))
	.set('aMayúscula', (it) => ensureMethod(it).appliesTo(textoAMayúsculas))
	.set('aMinusculas', (it) => ensureMethod(it).appliesTo(textoAMinúsculas))
	.set('aMinúsculas', (it) => ensureMethod(it).appliesTo(textoAMinúsculas))
	.set('aMayusculas', (it) => ensureMethod(it).appliesTo(textoAMayúsculas))
	.set('aMayúsculas', (it) => ensureMethod(it).appliesTo(textoAMayúsculas))
	.set('aRepetida', (it) => ensureMethod(it).arg('Number').appliesTo(textoRepetido))
	.set('aRepetido', (it) => ensureMethod(it).arg('Number').appliesTo(textoRepetido))
	.set('caracterEn', (it) => ensureMethod(it).arg('Number').appliesTo(textoCaracterEn))
	.set('comienzaCon', (it) => ensureMethod(it).arg('Text').appliesTo(textoComienzaCon))
	.set('contiene', (it) => ensureMethod(it).arg('Text').appliesTo(textoContiene))
	.set('cortar', (it) => ensureMethod(it).opt('Number').opt('Number').appliesTo(textoCortar))
	.set('incluye', (it) => ensureMethod(it).arg('Text').appliesTo(textoContiene))
	.set('normalizar', (it) => ensureMethod(it).appliesTo(textoNormalizar))
	.set('normalizado', (it) => ensureMethod(it).appliesTo(textoNormalizar))
	.set('partir', (it) => ensureMethod(it).arg('Text').appliesTo(textoPartir))
	.set('posicionDe', (it) => ensureMethod(it).arg('Text').appliesTo(textoPosiciónDe))
	.set('posiciónDe', (it) => ensureMethod(it).arg('Text').appliesTo(textoPosiciónDe))
	.set('reemplazar', (it) => ensureMethod(it).arg('Text').arg('Text').appliesTo(textoReemplazar))
	.set('repetida', (it) => ensureMethod(it).arg('Number').appliesTo(textoRepetido))
	.set('repetido', (it) => ensureMethod(it).arg('Number').appliesTo(textoRepetido))
	.set('terminaCon', (it) => ensureMethod(it).arg('Text').appliesTo(textoTerminaCon))
	.set('ultimaPosicionDe', (it) => ensureMethod(it).arg('Text').appliesTo(textoÚltimaPosiciónDe))
	.set('últimaPosiciónDe', (it) => ensureMethod(it).arg('Text').appliesTo(textoÚltimaPosiciónDe));
