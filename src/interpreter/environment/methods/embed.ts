/** biome-ignore-all lint/correctness/noEmptyPattern: Explicitly stating that all these functions take an array of args. */

import { stringHexToNumber } from '../../../util/utils';
import {
	type BooleanValue,
	type EmbedValue,
	type NativeFunction,
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
	type OptionalArg,
	psFileRegex,
	psLinkRegex,
} from '../nativeUtils';
import { makeEmbedRegistry } from '../registryPrefabs';
import type { MapOfMethodCompilers } from './types';

export type EmbedMethod<
	TArg extends RuntimeValue[] = RuntimeValue[],
	TResult extends RuntimeValue = RuntimeValue,
> = NativeFunction<EmbedValue, TArg, TResult>;

const marcoAgregarCampo: EmbedMethod<
	[TextValue, TextValue, OptionalArg<BooleanValue>],
	EmbedValue
> = (self, [nombre, valor, alineado], scope) => {
	const nombreResult = expectParam('nombre', nombre, ValueKinds.TEXT, scope);
	const valorResult = expectParam('valor', valor, ValueKinds.TEXT, scope);
	const alineadoResult = getParamOrDefault(
		'alineado',
		alineado,
		ValueKinds.BOOLEAN,
		scope,
		false,
	);

	if (nombreResult.value.length === 0)
		throw scope.interpreter.TuberInterpreterError(
			'El nombre del campo de Marco no puede estar vacío',
		);

	if (valorResult.value.length === 0)
		throw scope.interpreter.TuberInterpreterError(
			'El valor del campo de Marco no puede estar vacío',
		);

	self.value.addFields({
		name: nombreResult.value,
		value: valorResult.value,
		inline: alineadoResult.value,
	});

	return self;
};

const marcoARegistro: EmbedMethod<[], RegistryValue> = (self, []) => {
	return makeEmbedRegistry(self.value);
};

const marcoAsignarAutor: EmbedMethod<[TextValue, OptionalArg<TextValue>], EmbedValue> = (
	self,
	[nombre, imagen],
	scope,
) => {
	const nombreResult = expectParam('nombre', nombre, ValueKinds.TEXT, scope);
	const [imagenExists, imagenResult] = getParamOrNada('imagen', imagen, ValueKinds.TEXT, scope);

	if (nombreResult.value.length === 0)
		throw scope.interpreter.TuberInterpreterError(
			'El nombre del autor del Marco no puede estar vacío',
		);

	if (!imagenExists) {
		self.value.setAuthor({ name: nombreResult.value });
		return self;
	}

	if (!psFileRegex.test(imagenResult.value))
		throw scope.interpreter.TuberInterpreterError(
			'Se esperaba un enlace válido para el ícono del autor del Marco',
		);

	self.value.setAuthor({
		name: nombreResult.value,
		iconUrl: imagenResult.value,
	});

	return self;
};

const marcoAsignarColor: EmbedMethod<[TextValue], EmbedValue> = (self, [color], scope) => {
	const colorResult = expectParam('color', color, ValueKinds.TEXT, scope);

	if (colorResult.value.length === 0)
		throw scope.interpreter.TuberInterpreterError(
			'No puedes especificar un Texto vacío para el color del Marco',
		);

	try {
		const targetColor = stringHexToNumber(colorResult.value);
		self.value.setColor(targetColor);
	} catch {
		throw scope.interpreter.TuberInterpreterError(
			`Se recibió un código de color inválido: "${colorResult.value}", en asignación de color de Marco`,
		);
	}

	return self;
};

const marcoAsignarDescripción: EmbedMethod<[TextValue], EmbedValue> = (
	self,
	[descripción],
	scope,
) => {
	const descripciónResult = expectParam('descripción', descripción, ValueKinds.TEXT, scope);

	if (descripciónResult.value.length === 0)
		throw scope.interpreter.TuberInterpreterError(
			'No puedes suministrar una descripción de Marco vacía',
		);

	self.value.setDescription(descripciónResult.value);
	return self;
};

const marcoAsignarEnlace: EmbedMethod<[TextValue], EmbedValue> = (self, [enlace], scope) => {
	const enlaceResult = expectParam('enlace', enlace, ValueKinds.TEXT, scope);

	if (!psLinkRegex.test(enlaceResult.value))
		throw scope.interpreter.TuberInterpreterError('Se esperaba un enlace válido para el Marco');

	self.value.setUrl(enlaceResult.value);
	return self;
};

const marcoAsignarImagen: EmbedMethod<[TextValue], EmbedValue> = (self, [imagen], scope) => {
	const imagenResult = expectParam('imagen', imagen, ValueKinds.TEXT, scope);

	if (!psFileRegex.test(imagenResult.value))
		throw scope.interpreter.TuberInterpreterError(
			'Se esperaba un enlace válido para la imagen del Marco',
		);

	self.value.setImage(imagenResult.value);
	return self;
};

const marcoAsignarMiniatura: EmbedMethod<[TextValue], EmbedValue> = (self, [imagen], scope) => {
	const imagenResult = expectParam('imagen', imagen, ValueKinds.TEXT, scope);

	if (!psFileRegex.test(imagenResult.value))
		throw scope.interpreter.TuberInterpreterError(
			'Se esperaba un enlace válido para la miniatura del Marco',
		);

	self.value.setThumbnail(imagenResult.value);
	return self;
};

const marcoAsignarPie: EmbedMethod<[TextValue, OptionalArg<TextValue>], EmbedValue> = (
	self,
	[pie, ícono],
	scope,
) => {
	const pieResult = expectParam('pie', pie, ValueKinds.TEXT, scope);
	const [íconoExists, íconoResult] = getParamOrNada('ícono', ícono, ValueKinds.TEXT, scope);

	if (pieResult.value.length === 0)
		throw scope.interpreter.TuberInterpreterError(
			'El texto de pie de Marco suministrado no puede estar vacío',
		);

	if (!íconoExists) {
		self.value.setFooter({ text: pieResult.value });
		return self;
	}

	if (!psFileRegex.test(íconoResult.value))
		throw scope.interpreter.TuberInterpreterError(
			'Se esperaba un enlace válido para el ícono del pie del Marco',
		);

	self.value.setFooter({
		text: pieResult.value,
		iconUrl: íconoResult.value,
	});

	return self;
};

const marcoAsignarTítulo: EmbedMethod<[TextValue], EmbedValue> = (self, [título], scope) => {
	const títuloResult = expectParam('título', título, ValueKinds.TEXT, scope);

	if (títuloResult.value.length === 0)
		throw scope.interpreter.TuberInterpreterError(
			'No puedes suministrar un título de Marco vacío',
		);

	self.value.setTitle(títuloResult.value);
	return self;
};

export const embedMethods: MapOfMethodCompilers<EmbedValue> = new Map();
embedMethods
	.set('agregar', (it) =>
		ensureMethod(it).arg('Text').arg('Text').opt('Boolean').appliesTo(marcoAgregarCampo),
	)
	.set('agregarCampo', (it) =>
		ensureMethod(it).arg('Text').arg('Text').opt('Boolean').appliesTo(marcoAgregarCampo),
	)
	.set('añadir', (it) =>
		ensureMethod(it).arg('Text').arg('Text').opt('Boolean').appliesTo(marcoAgregarCampo),
	)
	.set('añadirCampo', (it) =>
		ensureMethod(it).arg('Text').arg('Text').opt('Boolean').appliesTo(marcoAgregarCampo),
	)
	.set('aRegistro', (it) => ensureMethod(it).appliesTo(marcoARegistro))
	.set('asignarAutor', (it) =>
		ensureMethod(it).arg('Text').opt('Text').appliesTo(marcoAsignarAutor),
	)
	.set('asignarColor', (it) => ensureMethod(it).arg('Text').appliesTo(marcoAsignarColor))
	.set('asignarDescripcion', (it) =>
		ensureMethod(it).arg('Text').appliesTo(marcoAsignarDescripción),
	)
	.set('asignarDescripción', (it) =>
		ensureMethod(it).arg('Text').appliesTo(marcoAsignarDescripción),
	)
	.set('asignarEnlace', (it) => ensureMethod(it).arg('Text').appliesTo(marcoAsignarEnlace))
	.set('asignarImagen', (it) => ensureMethod(it).arg('Text').appliesTo(marcoAsignarImagen))
	.set('asignarMiniatura', (it) => ensureMethod(it).arg('Text').appliesTo(marcoAsignarMiniatura))
	.set('asignarPie', (it) => ensureMethod(it).arg('Text').opt('Text').appliesTo(marcoAsignarPie))
	.set('asignarTitulo', (it) => ensureMethod(it).arg('Text').appliesTo(marcoAsignarTítulo))
	.set('asignarTítulo', (it) => ensureMethod(it).arg('Text').appliesTo(marcoAsignarTítulo));
