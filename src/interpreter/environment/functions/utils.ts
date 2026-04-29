/** biome-ignore-all lint/correctness/noEmptyPattern: Explicitly stating that all these functions take an array of args. */

import axios, { AxiosError } from 'axios';
import { sleep } from 'bun';
import { hsl2hex, hsv2hex, rgb2hex } from '../../../util/colorUtils';
import { rand, randRange } from '../../../util/utils';
import {
	type BooleanValue,
	makeBoolean,
	makeNada,
	makeNumber,
	makePromise,
	makeRegistry,
	makeText,
	type NadaValue,
	type NativeFunction,
	type NumberValue,
	type PromiseValue,
	type RegistryValue,
	type RuntimeValue,
	type TextValue,
	type ValueKind,
	ValueKinds,
} from '../../values';
import {
	ensureFn,
	expectParam,
	getParamOrNada,
	makeRuntimeValueFromInternalValue,
	type OptionalArg,
} from '../nativeUtils';
import type { NativeFunctionEntry } from './types';

const aleatorio: NativeFunction<
	null,
	readonly [OptionalArg<NumberValue>, OptionalArg<NumberValue>],
	NumberValue
> = (_self, [n, m], scope) => {
	const [nExists, nResult] = getParamOrNada('n', n, ValueKinds.NUMBER, scope);
	if (!nExists) return makeNumber(Math.random());

	const [mExists, mResult] = getParamOrNada('m', m, ValueKinds.NUMBER, scope);
	if (!mExists) return makeNumber(rand(nResult.value, false));

	return makeNumber(randRange(nResult.value, mResult.value, false));
};

const colorAleatorio: NativeFunction<null, readonly [], TextValue> = (_self, []) => {
	const colorNumber = ((Math.random() * 0xfffffe) << 0) + 1;
	const colorString = `#${colorNumber.toString(16).padStart(6, '0')}`;
	return makeText(colorString);
};

const colorRGB: NativeFunction<
	null,
	readonly [NumberValue, NumberValue, NumberValue],
	TextValue
> = (_self, [rojo, verde, azul], scope) => {
	const rojoValue = expectParam('rojo', rojo, ValueKinds.NUMBER, scope).value;
	const verdeValue = expectParam('verde', verde, ValueKinds.NUMBER, scope).value;
	const azulValue = expectParam('azul', azul, ValueKinds.NUMBER, scope).value;

	if (rojoValue < 0 || rojoValue > 255)
		throw scope.interpreter.TuberInterpreterError(
			`El canal rojo del color debe ser un valor entre 0 y 255 inclusive`,
		);

	if (verdeValue < 0 || verdeValue > 255)
		throw scope.interpreter.TuberInterpreterError(
			`El canal verde del color debe ser un valor entre 0 y 255 inclusive`,
		);

	if (azulValue < 0 || azulValue > 255)
		throw scope.interpreter.TuberInterpreterError(
			`El canal azul del color debe ser un valor entre 0 y 255 inclusive`,
		);

	const colorString = rgb2hex(rojoValue, verdeValue, azulValue);
	return makeText(colorString);
};

const colorHSL: NativeFunction<
	null,
	readonly [NumberValue, NumberValue, NumberValue],
	TextValue
> = (_self, [matiz, saturación, luminidad], scope) => {
	const matizValue = expectParam('matiz', matiz, ValueKinds.NUMBER, scope).value;
	const saturaciónValue = expectParam('saturación', saturación, ValueKinds.NUMBER, scope).value;
	const luminidadValue = expectParam('luminidad', luminidad, ValueKinds.NUMBER, scope).value;

	if (matizValue < 0 || matizValue >= 360)
		throw scope.interpreter.TuberInterpreterError(
			`La matiz del color debe ser un valor entre 0 (inclusive) y 360 (exclusive)`,
		);

	if (saturaciónValue < 0 || saturaciónValue > 1)
		throw scope.interpreter.TuberInterpreterError(
			`La saturación del color debe ser un valor entre 0 y 1 inclusive`,
		);

	if (luminidadValue < 0 || luminidadValue > 1)
		throw scope.interpreter.TuberInterpreterError(
			`La luminidad del color debe ser un valor entre 0 y 1 inclusive`,
		);

	const colorString = hsl2hex(matizValue, saturaciónValue, luminidadValue);
	return makeText(colorString);
};

const colorHSV: NativeFunction<
	null,
	readonly [NumberValue, NumberValue, NumberValue],
	TextValue
> = (_self, [matiz, saturación, brillo], scope) => {
	const matizValue = expectParam('matiz', matiz, ValueKinds.NUMBER, scope).value;
	const saturaciónValue = expectParam('saturación', saturación, ValueKinds.NUMBER, scope).value;
	const brilloValue = expectParam('brillo', brillo, ValueKinds.NUMBER, scope).value;

	if (matizValue < 0 || matizValue >= 360)
		throw scope.interpreter.TuberInterpreterError(
			`La matiz del color debe ser un valor entre 0 (inclusive) y 360 (exclusive)`,
		);

	if (saturaciónValue < 0 || saturaciónValue > 1)
		throw scope.interpreter.TuberInterpreterError(
			`La saturación del color debe ser un valor entre 0 y 1 inclusive`,
		);

	if (brilloValue < 0 || brilloValue > 1)
		throw scope.interpreter.TuberInterpreterError(
			`El brillo del color debe ser un valor entre 0 y 1 inclusive`,
		);

	const colorString = hsv2hex(matizValue, saturaciónValue, brilloValue);
	return makeText(colorString);
};

const cos: NativeFunction<null, readonly [NumberValue], NumberValue | NadaValue> = (
	_self,
	[valor],
	scope,
) => {
	const valorValue = expectParam('valor', valor, ValueKinds.NUMBER, scope).value;

	const cos = Math.cos(valorValue);
	return makeNumber(cos);
};

const dado: NativeFunction<
	null,
	readonly [OptionalArg<NumberValue>, OptionalArg<NumberValue>],
	NumberValue
> = (_self, [n, m], scope) => {
	const [nExists, nResult] = getParamOrNada('n', n, ValueKinds.NUMBER, scope);
	if (!nExists) return makeNumber(rand(6, true) + 1);

	const [mExists, mResult] = getParamOrNada('m', m, ValueKinds.NUMBER, scope);
	if (!mExists) return makeNumber(rand(nResult.value, true));

	return makeNumber(randRange(nResult.value, mResult.value, true));
};

const elegir: NativeFunction<null, readonly RuntimeValue[], RuntimeValue> = (
	_self,
	valores,
	scope,
) => {
	if (valores.length === 0)
		throw scope.interpreter.TuberInterpreterError(
			`Se esperaba un valor para el parámetro requerido \`x1\` para elegir aleatoriamente`,
		);

	if (valores.length === 1) return valores[0];

	const idx = rand(valores.length, true);
	return valores[idx];
};

const esPrueba: NativeFunction<null, readonly [], BooleanValue> = (_self, [], scope) => {
	return makeBoolean(scope.interpreter.isTestDrive());
};

const maximizar: NativeFunction<null, readonly NumberValue[], NumberValue> = (
	_self,
	números,
	scope,
) => {
	if (números.length === 0)
		throw scope.interpreter.TuberInterpreterError(
			`Se esperaba un valor para el parámetro requerido \`x1\` para obtener un máximo`,
		);

	if (números.length === 1) return números[0];

	const max = Math.max(...números.map((n) => n.value));
	return makeNumber(max);
};

const minimizar: NativeFunction<null, readonly NumberValue[], NumberValue> = (
	_self,
	números,
	scope,
) => {
	if (números.length === 0)
		throw scope.interpreter.TuberInterpreterError(
			`Se esperaba un valor para el parámetro requerido \`x1\` para obtener un mínimo`,
		);

	if (números.length === 1) return números[0];

	const min = Math.min(...números.map((n) => n.value));
	return makeNumber(min);
};

const quedanEntradas: NativeFunction<null, readonly [], BooleanValue> = (_self, [], scope) => {
	const test = scope.interpreter.hasArgs;
	return makeBoolean(test);
};

const radianes: NativeFunction<null, readonly [NumberValue], NumberValue> = (
	_self,
	[grados],
	scope,
) => {
	const gradosValue = expectParam('grados', grados, ValueKinds.NUMBER, scope).value;

	const radianes = (gradosValue * Math.PI) / 180;
	return makeNumber(radianes);
};

const raíz: NativeFunction<null, readonly [NumberValue, NumberValue], NumberValue | NadaValue> = (
	_self,
	[radicando, grado],
	scope,
) => {
	const radicandoValue = expectParam('radicando', radicando, ValueKinds.NUMBER, scope);
	const gradoValue = expectParam('grado', grado, ValueKinds.NUMBER, scope);

	const root = radicandoValue.value ** (1 / gradoValue.value);

	if (Number.isNaN(+root)) return makeNada();

	return makeNumber(root);
};

const sen: NativeFunction<null, readonly [NumberValue], NumberValue> = (_self, [valor], scope) => {
	const valorValue = expectParam('valor', valor, ValueKinds.NUMBER, scope).value;

	const sin = Math.sin(valorValue);
	return makeNumber(sin);
};

const tan: NativeFunction<null, readonly [NumberValue], NumberValue> = (_self, [valor], scope) => {
	const valorValue = expectParam('valor', valor, ValueKinds.NUMBER, scope).value;

	const tan = Math.tan(valorValue);
	return makeNumber(tan);
};

const tipoDe: NativeFunction<null, readonly [RuntimeValue], TextValue> = (
	_self,
	[valor],
	scope,
) => {
	if (valor == null)
		throw scope.interpreter.TuberInterpreterError(
			'Se esperaba un valor para el parámetro requerido `valor`',
		);

	const mappings = {
		Number: 'número',
		Text: 'texto',
		Boolean: 'lógico',
		List: 'lista',
		Registry: 'registro',
		Embed: 'marco',
		Canvas: 'marco',
		Image: 'marco',
		Function: 'función',
		NativeFunction: 'función',
		Promise: 'promesa',
		Nada: 'nada',
	} as const satisfies Record<ValueKind, string>;

	const result = mappings[valor.kind];

	return makeText(result);
};

const pausa: NativeFunction<null, readonly [NumberValue], PromiseValue<NadaValue>> = (
	_self,
	[valor],
	scope,
) => {
	const valorValue = expectParam('valor', valor, ValueKinds.NUMBER, scope).value;

	return makePromise(async () => {
		await sleep(valorValue);
		return makeNada();
	});
};

const obtener: NativeFunction<null, readonly [TextValue], PromiseValue<RegistryValue>> = (
	_self,
	[valor],
) => {
	return makePromise(async () => {
		try {
			const result = await axios.get(valor.value);
			const status = makeNumber(result.status);
			if (result.status >= 200 && result.status < 400) {
				const success = makeBoolean(true);
				return makeRegistry({
					éxito: success,
					exito: success,
					código: status,
					codigo: status,
					datos: makeRuntimeValueFromInternalValue(result.data, { omitFunctions: true }),
				});
			} else {
				const success = makeBoolean(false);
				return makeRegistry({
					éxito: success,
					exito: success,
					código: status,
					codigo: status,
					datos: makeRuntimeValueFromInternalValue(result.data, { omitFunctions: true }),
				});
			}
		} catch (err) {
			const success = makeBoolean(false);
			if (err instanceof AxiosError) {
				return makeRegistry({
					éxito: success,
					exito: success,
					código: makeNumber(err.status ?? -1),
					codigo: makeNumber(err.status ?? -1),
					mensaje: makeText(
						err?.message
							?? 'Ocurrió un problema desconocido al obtener los datos pedidos.',
					),
				});
			} else {
				const message = Error.isError(err) ? err?.message : undefined;
				return makeRegistry({
					éxito: success,
					exito: success,
					código: makeNumber(-1),
					codigo: makeNumber(-1),
					mensaje: makeText(message ?? 'No se especificó el problema.'),
				});
			}
		}
	});
};

export const utilFunctions: NativeFunctionEntry[] = [
	{ id: 'aleatorio', fn: (it) => ensureFn(it).opt('Number').opt('Number').appliesTo(aleatorio) },
	{ id: 'colorAleatorio', fn: (it) => ensureFn(it).appliesTo(colorAleatorio) },
	{ id: 'cos', fn: (it) => ensureFn(it).arg('Number').appliesTo(cos) },
	{ id: 'dado', fn: (it) => ensureFn(it).opt('Number').opt('Number').appliesTo(dado) },
	{ id: 'elegir', fn: (it) => ensureFn(it).rest().appliesTo(elegir) },
	{ id: 'esPrueba', fn: (it) => ensureFn(it).appliesTo(esPrueba) },
	{ id: 'hayEntradas', fn: (it) => ensureFn(it).appliesTo(quedanEntradas) },
	{
		id: 'hsl',
		fn: (it) => ensureFn(it).arg('Number').arg('Number').arg('Number').appliesTo(colorHSL),
	},
	{
		id: 'hsb',
		fn: (it) => ensureFn(it).arg('Number').arg('Number').arg('Number').appliesTo(colorHSV),
	},
	{
		id: 'hsv',
		fn: (it) => ensureFn(it).arg('Number').arg('Number').arg('Number').appliesTo(colorHSV),
	},
	{ id: 'maximizar', fn: (it) => ensureFn(it).appliesTo(maximizar) },
	{ id: 'minimizar', fn: (it) => ensureFn(it).appliesTo(minimizar) },
	{ id: 'quedanEntradas', fn: (it) => ensureFn(it).appliesTo(quedanEntradas) },
	{ id: 'radianes', fn: (it) => ensureFn(it).arg('Number').appliesTo(radianes) },
	{ id: 'raiz', fn: (it) => ensureFn(it).arg('Number').arg('Number').appliesTo(raíz) },
	{ id: 'raíz', fn: (it) => ensureFn(it).arg('Number').arg('Number').appliesTo(raíz) },
	{
		id: 'rgb',
		fn: (it) => ensureFn(it).arg('Number').arg('Number').arg('Number').appliesTo(colorRGB),
	},
	{ id: 'sen', fn: (it) => ensureFn(it).arg('Number').appliesTo(sen) },
	{ id: 'tan', fn: (it) => ensureFn(it).arg('Number').appliesTo(tan) },
	{ id: 'tipoDe', fn: (it) => ensureFn(it).opt().appliesTo(tipoDe) },
	{ id: 'pausa', fn: (it) => ensureFn(it).arg('Number').appliesTo(pausa) },
	{ id: 'pausar', fn: (it) => ensureFn(it).arg('Number').appliesTo(pausa) },
	{ id: 'obtener', fn: (it) => ensureFn(it).arg('Text').appliesTo(obtener) },
];
