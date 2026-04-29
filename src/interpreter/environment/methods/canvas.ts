/** biome-ignore-all lint/correctness/noEmptyPattern: Explicitly stating that all these functions take an array of args. */

import { stringHexToNumber, toLowerCaseNormalized } from '../../../util/utils';
import {
	type CanvasValue,
	type ImageValue,
	makeNada,
	makeNumber,
	makePromise,
	makeRegistry,
	type NadaValue,
	type NativeFunction,
	type NumberValue,
	type PromiseValue,
	type RegistryValue,
	type RuntimeValue,
	type TextValue,
	ValueKinds,
	ValueKindTranslationLookups,
} from '../../values';
import {
	type PSCanvasDrawTextOptions,
	type PSCanvasTextAlignment,
	PSCanvasTextAlignments,
	type PSCanvasTextBaseline,
	PSCanvasTextBaselines,
	type PSImageResolvable,
} from '../constructs/psCanvas';
import { expectParam, getParamOrDefault, getParamOrNada } from '../nativeUtils';

export type CanvasMethod<
	TArg extends RuntimeValue[] = RuntimeValue[],
	TResult extends RuntimeValue = RuntimeValue,
> = NativeFunction<CanvasValue, TArg, TResult>;

const lienzoAlinearTexto: CanvasMethod<[TextValue, TextValue | NadaValue], NadaValue> = (
	self,
	[horizontal, vertical],
	scope,
) => {
	const horizontalResult = expectParam('alineadoHorizontal', horizontal, ValueKinds.TEXT, scope);
	const verticalResult = getParamOrDefault(
		'alineadoVertical',
		vertical,
		ValueKinds.TEXT,
		scope,
		PSCanvasTextBaselines.SUPERIOR,
	);

	const alignment = toLowerCaseNormalized(horizontalResult.value) as PSCanvasTextAlignment;
	const baseline = toLowerCaseNormalized(verticalResult.value) as PSCanvasTextBaseline;

	if (!Object.values(PSCanvasTextAlignments).includes(alignment))
		throw scope.interpreter.TuberInterpreterError(
			`El tipo de alineación horizontal debe ser uno de los siguientes: ${Object.keys(PSCanvasTextAlignments).map((k) => `"${k}"`)}`,
		);

	if (!Object.values(PSCanvasTextBaselines).includes(baseline))
		throw scope.interpreter.TuberInterpreterError(
			`El tipo de alineación vertical debe ser uno de los siguientes: ${Object.keys(PSCanvasTextBaselines).map((k) => `"${k}"`)}`,
		);

	self.canvas.setTextAlignment(alignment);
	self.canvas.setTextBaseline(baseline);

	return makeNada();
};

const lienzoARegistro: CanvasMethod<[], RegistryValue> = (self, []) => {
	return makeRegistry({
		ancho: makeNumber(self.canvas.width),
		alto: makeNumber(self.canvas.height),
	});
};

const lienzoCrearImagen: CanvasMethod<[], PromiseValue<ImageValue>> = (self, []) => {
	return makePromise(async () => {
		return self.canvas.renderImage();
	});
};

const lienzoDibujarImagen: CanvasMethod<
	[NumberValue, NumberValue, RuntimeValue],
	PromiseValue<NadaValue>
> = (self, [x, y, imagen], scope) => {
	const xResult = expectParam('posX', x, ValueKinds.NUMBER, scope);
	const yResult = expectParam('posY', y, ValueKinds.NUMBER, scope);

	if (imagen == null || imagen.kind === ValueKinds.NADA)
		throw scope.interpreter.TuberInterpreterError('Debes indicar una imagen a dibujar');

	let psImageResolvable: PSImageResolvable;
	if (imagen.kind === ValueKinds.IMAGE) psImageResolvable = imagen.buffer;
	else if (imagen.kind === ValueKinds.TEXT) psImageResolvable = new URL(imagen.value);
	else
		throw scope.interpreter.TuberInterpreterError(
			`La imagen a dibujar no era de un tipo válido: \`${ValueKindTranslationLookups.get(imagen.kind) ?? 'Nada'}\``,
		);

	return makePromise(async () => {
		try {
			await self.canvas.drawImage(xResult.value, yResult.value, psImageResolvable);
		} catch (err) {
			console.error(err);
			throw scope.interpreter.TuberInterpreterError(
				'Debes indicar una imagen válida a dibujar.',
			);
		}

		return makeNada();
	});
};

const lienzoDibujarTexto: CanvasMethod<
	[NumberValue, NumberValue, TextValue, RegistryValue | NadaValue],
	PromiseValue<NadaValue>
> = (self, [x, y, texto, propiedades], scope) => {
	const xResult = expectParam('posX', x, ValueKinds.NUMBER, scope);
	const yResult = expectParam('posY', y, ValueKinds.NUMBER, scope);
	const textResult = expectParam('txt', texto, ValueKinds.TEXT, scope);
	const [propiedadesExists, propiedadesResult] = getParamOrNada(
		'propiedades',
		propiedades,
		ValueKinds.REGISTRY,
		scope,
	);

	let propiedadesObject: PSCanvasDrawTextOptions = {};
	if (propiedadesExists) {
		const [colorExists, colorResult] = getParamOrNada(
			'color',
			propiedadesResult.entries.get('color') as RuntimeValue,
			ValueKinds.TEXT,
			scope,
		);
		const [bordeExists, bordeResult] = getParamOrNada(
			'borde',
			propiedadesResult.entries.get('borde') as RuntimeValue,
			ValueKinds.TEXT,
			scope,
		);
		const [grosorExists, grosorResult] = getParamOrNada(
			'grosor',
			propiedadesResult.entries.get('grosor') as RuntimeValue,
			ValueKinds.NUMBER,
			scope,
		);
		const [tamañoExists, tamañoResult] = getParamOrNada(
			'tamaño',
			propiedadesResult.entries.get('tamaño') as RuntimeValue,
			ValueKinds.NUMBER,
			scope,
		);
		const [negritaExists, negritaResult] = getParamOrNada(
			'negrita',
			propiedadesResult.entries.get('negrita') as RuntimeValue,
			ValueKinds.BOOLEAN,
			scope,
		);
		const [cursivaExists, cursivaResult] = getParamOrNada(
			'cursiva',
			propiedadesResult.entries.get('cursiva') as RuntimeValue,
			ValueKinds.BOOLEAN,
			scope,
		);

		if (colorExists) {
			if (colorResult.value.length === 0)
				throw scope.interpreter.TuberInterpreterError(
					'No puedes especificar un Texto vacío para el color del texto',
				);

			try {
				propiedadesObject.fillColor = stringHexToNumber(colorResult.value);
			} catch {
				throw scope.interpreter.TuberInterpreterError(
					`Se recibió un código de color inválido: "${colorResult.value}", en asignación de color de texto`,
				);
			}
		}

		if (bordeExists) {
			if (colorResult.value == null || colorResult.value.length === 0)
				throw scope.interpreter.TuberInterpreterError(
					'No puedes especificar un Texto vacío para el color del texto',
				);

			try {
				propiedadesObject.strokeColor = stringHexToNumber(bordeResult.value);
			} catch {
				throw scope.interpreter.TuberInterpreterError(
					`Se recibió un código de color inválido: "${colorResult.value}", en asignación de color de texto`,
				);
			}
		}

		if (grosorExists) propiedadesObject.strokeWidth = grosorResult.value;

		if (tamañoExists) propiedadesObject.fontSize = tamañoResult.value;

		if (negritaExists) propiedadesObject.bold = negritaResult.value;

		if (cursivaExists) propiedadesObject.italic = cursivaResult.value;
	} else {
		propiedadesObject = {};
	}

	return makePromise(async () => {
		try {
			await self.canvas.drawText(
				xResult.value,
				yResult.value,
				textResult.value,
				propiedadesObject,
			);
		} catch (err) {
			console.error(err);
			throw scope.interpreter.TuberInterpreterError(
				'Debes indicar una imagen válida a dibujar.',
			);
		}

		return makeNada();
	});
};

export const canvasMethods = new Map<string, CanvasMethod>()
	.set('alinearTexto', lienzoAlinearTexto as CanvasMethod)
	.set('aRegistro', lienzoARegistro as CanvasMethod)
	.set('crearImagen', lienzoCrearImagen as CanvasMethod)
	.set('dibujarImagen', lienzoDibujarImagen as CanvasMethod)
	.set('dibujarTexto', lienzoDibujarTexto as CanvasMethod);
