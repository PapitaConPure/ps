/* eslint-disable no-empty-pattern */

import { RuntimeValue, NativeFunction, ValueKinds, ValueKind, NumberValue, TextValue, RegistryValue, CanvasValue, PromiseValue, NadaValue, makeNumber, makeRegistry, makePromise, makeNada, AssertedRuntimeValue, ValueKindTranslationLookups } from '../../values';
import { PSCanvasTextAlignment, PSCanvasTextAlignments, PSCanvasTextBaseline, PSCanvasTextBaselines, PSImageResolvable } from '../constructs/psCanvas';
import { expectParam, getParamOrDefault } from '../nativeUtils';
import { toLowerCaseNormalized } from '../../../util/utils';

export type CanvasMethod<TArg extends RuntimeValue[] = RuntimeValue[], TResult extends RuntimeValue = RuntimeValue>
	= NativeFunction<CanvasValue, TArg, TResult>;

const lienzoAlinearTexto: CanvasMethod<[ TextValue, TextValue | NadaValue ], NadaValue> = (self, [ horizontal, vertical ], scope) => {
	const horizontalResult = expectParam('alineadoHorizontal', horizontal, ValueKinds.TEXT, scope);
	const verticalResult = getParamOrDefault('alineadoVertical', vertical, ValueKinds.TEXT, scope, PSCanvasTextBaselines.SUPERIOR);

	const alignment = toLowerCaseNormalized(horizontalResult.value) as PSCanvasTextAlignment;
	const baseline = toLowerCaseNormalized(verticalResult.value) as PSCanvasTextBaseline;

	if(!Object.values(PSCanvasTextAlignments).includes(alignment))
		throw scope.interpreter.TuberInterpreterError(`El tipo de alineación horizontal debe ser uno de los siguientes: ${Object.keys(PSCanvasTextAlignments).map(k => `"${k}"`)}`);

	if(!Object.values(PSCanvasTextBaselines).includes(baseline))
		throw scope.interpreter.TuberInterpreterError(`El tipo de alineación vertical debe ser uno de los siguientes: ${Object.keys(PSCanvasTextBaselines).map(k => `"${k}"`)}`);

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

const imageValueLookups = ({
	Text: x => x.value,
	Image: x => x.buffer,
}) as const satisfies Partial<{ [K in ValueKind]: (x: AssertedRuntimeValue<K>) => PSImageResolvable }>;

const lienzoDibujarImagen: CanvasMethod<[ NumberValue, NumberValue, RuntimeValue ], PromiseValue<NadaValue>> = (self, [ x, y, imagen ], scope) => {
	const xResult = expectParam('posX', x, ValueKinds.NUMBER, scope);
	const yResult = expectParam('posY', y, ValueKinds.NUMBER, scope);

	if(imagen == null || imagen.kind === ValueKinds.NADA)
		throw scope.interpreter.TuberInterpreterError('Debes indicar una imagen a dibujar');

	const psImageResolvable = imageValueLookups[imagen.kind];

	if(imagen.kind !== ValueKinds.TEXT && imagen.kind !== ValueKinds.LIST && imagen.kind !== ValueKinds.IMAGE)
		throw scope.interpreter.TuberInterpreterError(`La imagen a dibujar no era de un tipo válido: \`${ValueKindTranslationLookups.get(imagen.kind) ?? 'Nada'}\``);

	return makePromise(async() => {
		try {
			await self.canvas.drawImage(xResult.value, yResult.value, psImageResolvable);
		} catch {
			throw scope.interpreter.TuberInterpreterError('Debes indicar una imagen válida a dibujar.');
		}

		return makeNada();
	});
};

export const canvasMethods = new Map<string, CanvasMethod>()
	.set('alinearTexto', lienzoAlinearTexto)
	.set('aRegistro', lienzoARegistro)
	.set('dibujarImagen', lienzoDibujarImagen);
