import type { ArgumentExpression, Expression } from '../ast/expressions';
import type { BlockStatement } from '../ast/statements';
import { EmbedData } from '../embedData';
import type { ValuesOf } from '../util/types';
import type { Interpreter } from '.';
import type { PSCanvas } from './environment';
import { makeRuntimeValueFromInternalValue } from './environment/nativeUtils';
import { makeEmbedRegistry } from './environment/registryPrefabs';
import type { Scope } from './scope';

/**@description Contiene los tipos de valores de PuréScript.*/
export const ValueKinds = {
	NUMBER: 'Number',
	TEXT: 'Text',
	BOOLEAN: 'Boolean',
	LIST: 'List',
	REGISTRY: 'Registry',
	EMBED: 'Embed',
	CANVAS: 'Canvas',
	IMAGE: 'Image',
	NATIVE_FN: 'NativeFunction',
	FUNCTION: 'Function',
	PROMISE: 'Promise',
	NADA: 'Nada',
} as const;
export type ValueKind = ValuesOf<typeof ValueKinds>;

interface BaseValueData<T extends ValueKind> {
	kind: T;
	compareTo: (o: RuntimeValue) => NumberValue;
	equals: (o: RuntimeValue) => BooleanValue;
}

interface BasePrimitiveValueData<U = undefined> {
	value: U;
}

export interface PrimitiveValueData<T extends ValueKind, U = undefined>
	extends BaseValueData<T>,
		BasePrimitiveValueData<U> {}

export type NumberValue = PrimitiveValueData<'Number', number>;

export type TextValue = PrimitiveValueData<'Text', string>;

export type BooleanValue = PrimitiveValueData<'Boolean', boolean>;

export type NadaValue = PrimitiveValueData<'Nada', null>;

export interface ListValueData {
	elements: RuntimeValue[];
}

export interface ListValue extends BaseValueData<'List'>, ListValueData {}

export interface RegistryValueData {
	entries: Map<string, RuntimeValue>;
}

export interface RegistryValue extends BaseValueData<'Registry'>, RegistryValueData {}

export type EmbedValue = PrimitiveValueData<'Embed', EmbedData>;

export interface CanvasValueData {
	canvas: PSCanvas;
}

export interface CanvasValue extends BaseValueData<'Canvas'>, CanvasValueData {}

export type ImageValueFormat = 'webp' | 'png' | 'jpeg' | 'bmp';

export interface ImageValueData {
	format: ImageValueFormat;
	width: number;
	height: number;
	buffer: Buffer<ArrayBufferLike>;
}

export interface ImageValue extends BaseValueData<'Image'>, ImageValueData {}

export type NativeFunction<
	TSelf extends RuntimeValue | null,
	TArg extends readonly RuntimeValue[],
	TReturn extends RuntimeValue,
> = (self: TSelf, args: TArg, scope: Scope) => TReturn;

export type AnyNativeFunction<TSelf extends RuntimeValue | null = RuntimeValue | null> =
	NativeFunction<TSelf, readonly RuntimeValue[], RuntimeValue>;

export type NativeMethod<
	TSelf extends RuntimeValue,
	TArg extends RuntimeValue[] = RuntimeValue[],
	TReturn extends RuntimeValue = RuntimeValue,
> = NativeFunction<TSelf, TArg, TReturn>;

interface NativeFunctionValueData {
	self?: RuntimeValue | null;
	call: AnyNativeFunction;
	with: (self?: RuntimeValue | null) => NativeFunctionValue;
}

export type NativeFunctionValue = BaseValueData<'NativeFunction'> & NativeFunctionValueData;

export interface BaseFunctionValueData {
	name: string;
	self: RuntimeValue;
	args: ArgumentExpression[];
}

export interface StandardFunctionValueData {
	lambda: false;
	body: BlockStatement;
	scope: Scope;
}

export interface DelegateValueData {
	lambda: true;
	expression: Expression;
}

export type FunctionValueData = BaseFunctionValueData &
	(StandardFunctionValueData | DelegateValueData);

export type FunctionValue = BaseValueData<'Function'> & FunctionValueData;

export type AnyFunctionValue = FunctionValue | NativeFunctionValue;

export type PrimitiveValue = NumberValue | TextValue | BooleanValue | NadaValue;

export type ComplexValue =
	| ListValue
	| RegistryValue
	| EmbedValue
	| CanvasValue
	| ImageValue
	| AnyFunctionValue;

export type TangibleValue = PrimitiveValue | ComplexValue;

export interface PromiseValue<TResult extends RuntimeValue = RuntimeValue>
	extends BaseValueData<'Promise'> {
	state: 'pending' | 'fulfilled';
	promised: () => Promise<TResult>;
	value?: TResult;
	error?: Error;
}

export type RuntimeValue = TangibleValue | PromiseValue;

interface RuntimeInternalValueMap {
	Number: number;
	Text: string;
	Boolean: boolean;
	Nada: null;

	List: RuntimeValue[];
	Registry: Map<string, RuntimeValue>;
	Embed: EmbedData;
	Canvas: PSCanvas;
	Image: ImageValueData;
	NativeFunction: AnyNativeFunction;
	Function: (x?: unknown) => RuntimeValue;
	Promise: () => Promise<RuntimeValue>;
}

export type RuntimeInternalValue<TValue extends ValueKind> = RuntimeInternalValueMap[TValue];

export function basicCompareTo(this: NumberValue | TextValue | BooleanValue, other: RuntimeValue) {
	if (this.kind !== other.kind) return makeNumber(-1);

	if (this.value === other.value) return makeNumber(0);

	return makeNumber(this.value < other.value ? -1 : 1);
}

export function invalidCompareTo(_other: RuntimeValue) {
	return makeNumber(-1);
}

export function basicEquals(
	this: Exclude<RuntimeValue, PartiallyCoercibleValue>,
	other: RuntimeValue,
) {
	return makeBoolean(
		this.kind === other.kind && extractInternal(this) === extractInternal(other),
	);
}

export function listEquals(this: ListValue, other: RuntimeValue) {
	return makeBoolean(
		other.kind === ValueKinds.LIST
			&& this.kind === other.kind
			&& this.elements === other.elements,
	);
}

export function registryEquals(this: RegistryValue, other: RuntimeValue) {
	return makeBoolean(
		other.kind === ValueKinds.REGISTRY
			&& this.kind === other.kind
			&& this.entries === other.entries,
	);
}

export function nativeFnEquals(this: NativeFunctionValue, other: RuntimeValue) {
	return makeBoolean(
		other.kind === ValueKinds.NATIVE_FN && this.kind === other.kind && this.call === other.call,
	);
}

export function referenceEquals(this: RuntimeValue, other: RuntimeValue) {
	return makeBoolean(this === other);
}

export const ValueKindTranslationLookups: Map<ValueKind, string> = new Map();
ValueKindTranslationLookups.set(ValueKinds.NUMBER, 'Número')
	.set(ValueKinds.TEXT, 'Texto')
	.set(ValueKinds.BOOLEAN, 'Lógico')
	.set(ValueKinds.LIST, 'Lista')
	.set(ValueKinds.REGISTRY, 'Registro')
	.set(ValueKinds.EMBED, 'Marco')
	.set(ValueKinds.FUNCTION, 'Función')
	.set(ValueKinds.NADA, 'Nada');

const CompareToMethodLookups = {
	[ValueKinds.NUMBER]: basicCompareTo,
	[ValueKinds.TEXT]: basicCompareTo,
	[ValueKinds.BOOLEAN]: basicCompareTo,
	[ValueKinds.LIST]: invalidCompareTo,
	[ValueKinds.REGISTRY]: invalidCompareTo,
	[ValueKinds.EMBED]: invalidCompareTo,
	[ValueKinds.NATIVE_FN]: invalidCompareTo,
	[ValueKinds.FUNCTION]: invalidCompareTo,
	[ValueKinds.PROMISE]: invalidCompareTo,
	[ValueKinds.CANVAS]: invalidCompareTo,
	[ValueKinds.IMAGE]: invalidCompareTo,
	[ValueKinds.NADA]: invalidCompareTo,
} as const satisfies {
	[KValueKind in ValueKind]: AssertedRuntimeValue<KValueKind>['compareTo'];
};

const EqualsMethodLookups = {
	[ValueKinds.NUMBER]: basicEquals,
	[ValueKinds.TEXT]: basicEquals,
	[ValueKinds.BOOLEAN]: basicEquals,
	[ValueKinds.LIST]: listEquals,
	[ValueKinds.REGISTRY]: registryEquals,
	[ValueKinds.EMBED]: basicEquals,
	[ValueKinds.NATIVE_FN]: nativeFnEquals,
	[ValueKinds.FUNCTION]: referenceEquals,
	[ValueKinds.PROMISE]: referenceEquals,
	[ValueKinds.CANVAS]: referenceEquals,
	[ValueKinds.IMAGE]: referenceEquals,
	[ValueKinds.NADA]: basicEquals,
} as const satisfies {
	[KValueKind in ValueKind]: AssertedRuntimeValue<KValueKind>['equals'];
};

export function makeNumber(value: number): NumberValue {
	const kind = ValueKinds.NUMBER;
	return {
		kind,
		value: +value,
		equals: EqualsMethodLookups[kind],
		compareTo: CompareToMethodLookups[kind],
	};
}

export function makeText(value: string): TextValue {
	const kind = ValueKinds.TEXT;
	return {
		kind,
		value: `${value}`,
		equals: EqualsMethodLookups[kind],
		compareTo: CompareToMethodLookups[kind],
	};
}

export function makeBoolean(value: boolean): BooleanValue {
	const kind = ValueKinds.BOOLEAN;
	return {
		kind,
		value: !!value,
		equals: EqualsMethodLookups[kind],
		compareTo: CompareToMethodLookups[kind],
	};
}

export function toggleBoolean(value: BooleanValue): BooleanValue {
	return makeBoolean(!value.value);
}

export function makeList(elements: RuntimeValue[]): ListValue {
	const kind = ValueKinds.LIST;
	return {
		kind,
		elements,
		equals: EqualsMethodLookups[kind],
		compareTo: CompareToMethodLookups[kind],
	};
}

export function makeRegistry(entries: { [K in string]: RuntimeValue }): RegistryValue;
export function makeRegistry(entries: Map<string, RuntimeValue>): RegistryValue;
export function makeRegistry(
	entries: Map<string, RuntimeValue> | Record<string, RuntimeValue>,
): RegistryValue {
	const kind = ValueKinds.REGISTRY;
	const actualEntries = entries instanceof Map ? entries : new Map(Object.entries(entries));

	return {
		kind,
		entries: actualEntries,
		equals: EqualsMethodLookups[kind],
		compareTo: CompareToMethodLookups[kind],
	};
}

export function makeEmbed(): EmbedValue {
	const kind = ValueKinds.EMBED;
	return {
		kind,
		value: new EmbedData(),
		equals: EqualsMethodLookups[kind],
		compareTo: CompareToMethodLookups[kind],
	};
}

export function makeCanvas(
	interpreter: Interpreter,
	width: NumberValue,
	height: NumberValue,
): CanvasValue {
	const kind = ValueKinds.CANVAS;
	return {
		kind,
		canvas: interpreter.provider.createCanvas(width.value, height.value),
		equals: EqualsMethodLookups[kind],
		compareTo: CompareToMethodLookups[kind],
	};
}

export function makeImage(
	format: ImageValueFormat,
	width: number,
	height: number,
	data: Buffer<ArrayBufferLike>,
): ImageValue {
	const kind = ValueKinds.IMAGE;
	return {
		kind,
		format,
		width,
		height,
		buffer: data,
		equals: EqualsMethodLookups[kind],
		compareTo: CompareToMethodLookups[kind],
	};
}

export function makePromise<TResult extends RuntimeValue>(
	promised: () => Promise<TResult>,
): PromiseValue<TResult> {
	const kind = ValueKinds.PROMISE;
	return {
		kind,
		state: 'pending',
		promised,
		equals: EqualsMethodLookups[kind],
		compareTo: CompareToMethodLookups[kind],
	};
}

export function makeNativeFunction(
	self: RuntimeValue | null | undefined,
	fn: AnyNativeFunction,
): NativeFunctionValue {
	const kind = ValueKinds.NATIVE_FN;
	return {
		kind,
		self,
		call: fn,
		equals: EqualsMethodLookups[kind],
		compareTo: CompareToMethodLookups[kind],
		with: function (self) {
			return makeNativeFunction(self, this.call);
		},
	};
}

export function makeFunction(
	body: BlockStatement,
	args: ArgumentExpression[],
	scope: Scope,
): FunctionValue {
	const kind = ValueKinds.FUNCTION;
	return {
		kind,
		lambda: false,
		name: '[Función]',
		self: makeNada(),
		body,
		args,
		scope,
		equals: EqualsMethodLookups[kind],
		compareTo: CompareToMethodLookups[kind],
	};
}

export function makeLambda(expression: Expression, args: ArgumentExpression[]): FunctionValue {
	const kind = ValueKinds.FUNCTION;
	return {
		kind,
		lambda: true,
		name: '[Lambda]',
		self: makeNada(),
		expression,
		args,
		equals: EqualsMethodLookups[kind],
		compareTo: CompareToMethodLookups[kind],
	};
}

export function makeNada(): NadaValue {
	const kind = ValueKinds.NADA;
	return {
		kind,
		value: null,
		equals: EqualsMethodLookups[kind],
		compareTo: CompareToMethodLookups[kind],
	};
}

export type AssertedRuntimeValue<T extends ValueKind> = Extract<RuntimeValue, { kind: T }>;

export const valueMakers: Partial<{
	[K in ValueKind]: (x: RuntimeInternalValue<K>) => AssertedRuntimeValue<K>;
}> = {
	[ValueKinds.NUMBER]: makeNumber,
	[ValueKinds.TEXT]: makeText,
	[ValueKinds.BOOLEAN]: makeBoolean,
	[ValueKinds.LIST]: makeList,
	[ValueKinds.REGISTRY]: makeRegistry,
	[ValueKinds.EMBED]: makeEmbed,
	[ValueKinds.PROMISE]: (x) => makePromise(x),
	[ValueKinds.NADA]: makeNada,
};

/**
 * @description
 * Crea un valor a partir de un tipo y un valor.
 * Esta función no convierte {@link RuntimeValue}s. Para convertir un {@link RuntimeValue} de tipo X a tipo Y, usa {@linkcode coerceValue}.
 */
export function makeValue<TValueKind extends keyof typeof valueMakers>(
	valueKind: TValueKind,
	value: RuntimeInternalValue<TValueKind>,
): AssertedRuntimeValue<TValueKind> {
	const makerFunction = valueMakers[valueKind];
	if (!makerFunction) throw `No Maker Function for ${valueKind}::${value}`;
	return makerFunction(value);
}

const defaultMakers: Partial<{ [K in ValueKind]: () => AssertedRuntimeValue<K> }> = {
	[ValueKinds.NUMBER]: () => makeNumber(0),
	[ValueKinds.TEXT]: () => makeText(''),
	[ValueKinds.BOOLEAN]: () => makeBoolean(false),
	[ValueKinds.EMBED]: makeEmbed,
	[ValueKinds.LIST]: () => makeList([]),
	[ValueKinds.REGISTRY]: () => makeRegistry(new Map()),
	[ValueKinds.PROMISE]: () => makePromise(async () => makeNada()),
	[ValueKinds.NADA]: makeNada,
};

/**
 * @description
 * Crea un valor por defecto a partir del tipo indicado.
 */
export function defaultValueOf<T extends ValueKind>(valueKind: T): AssertedRuntimeValue<T> {
	const makerFunction = defaultMakers[valueKind];
	if (!makerFunction) throw `No Maker Function for ${valueKind}::default`;
	return makerFunction();
}

/**@description Comprueba si un RuntimeValue existe, es de tipo Número y es numéricamente operable.*/
export function isOperable(runtimeValue: RuntimeValue): runtimeValue is NumberValue {
	if (runtimeValue == null || runtimeValue.kind !== ValueKinds.NUMBER) return false;

	return !Number.isNaN(+runtimeValue.value) && Number.isFinite(+runtimeValue.value);
}

/**@description Comprueba si un valor existe y es numéricamente operable.*/
export function isInternalOperable(value: unknown): value is number {
	return value != null && !Number.isNaN(+value) && Number.isFinite(+value);
}

/**@description Comprueba si un RuntimeValue es de tipo Texto.*/
export function isValidText(runtimeValue: RuntimeValue): runtimeValue is TextValue {
	return runtimeValue?.kind === ValueKinds.TEXT;
}

/**@description Comprueba si un RuntimeValue es de tipo Lógico.*/
export function isBoolean(runtimeValue: RuntimeValue): runtimeValue is BooleanValue {
	return runtimeValue?.kind === ValueKinds.BOOLEAN;
}

/**@description Comprueba si un RuntimeValue es de tipo Lista.*/
export function isList(runtimeValue: RuntimeValue): runtimeValue is ListValue {
	return runtimeValue?.kind === ValueKinds.LIST;
}

/**@description Comprueba si un RuntimeValue es de tipo Registro.*/
export function isRegistry(runtimeValue: RuntimeValue): runtimeValue is RegistryValue {
	return runtimeValue?.kind === ValueKinds.REGISTRY;
}

/**@description Comprueba si un RuntimeValue es de tipo Marco.*/
export function isEmbed(runtimeValue: RuntimeValue): runtimeValue is EmbedValue {
	return runtimeValue?.kind === ValueKinds.EMBED;
}

/**@description Comprueba si un RuntimeValue es de tipo Nada.*/
export function isNada(runtimeValue: RuntimeValue): runtimeValue is NadaValue {
	return runtimeValue?.kind === ValueKinds.NADA;
}

/**@description Comprueba si un RuntimeValue es de tipo Nada.*/
export function isInternalNull(
	runtimeValue: RuntimeValue | null | undefined,
): runtimeValue is NadaValue | null {
	return runtimeValue == null || runtimeValue.kind === ValueKinds.NADA;
}

export function extendList(list: ListValue, item: RuntimeValue, position: number | null = null) {
	list.elements.splice(position ?? list.elements.length, 0, item);
}

export type PartiallyCoercibleValue = FunctionValue | NativeFunctionValue;

export type HasInternal<TValueKind extends ValueKind> =
	TValueKind extends PartiallyCoercibleValue['kind'] ? false : true;

export type CoercibleInternalValue<TValueKind extends ValueKind> =
	HasInternal<TValueKind> extends true ? RuntimeInternalValue<TValueKind> : never;

export type CoercionMap = {
	[TSourceKind in ValueKind]: Partial<{
		[TTargetKind in ValueKind]: (
			x: CoercibleInternalValue<TSourceKind>,
			interpreter: Interpreter,
		) => AssertedRuntimeValue<TTargetKind> | null;
	}>;
};

const coercions = {
	Number: {
		Number: (x) => makeNumber(+x),
		Text: (x) => makeText(`${x ?? 'Nada'}`),
		Boolean: (x) => makeBoolean(!!x),
	},
	Text: {
		Number: (x) => makeNumber(isInternalOperable(+x) ? +x : 0),
		Text: (x) => makeText(`${x}`),
		Boolean: (x) => makeBoolean(!!x),
		[ValueKinds.LIST]: (x: string) => makeList(x.split('').map(makeText)),
	},
	Boolean: {
		Number: (x) => makeNumber(x ? 1 : 0),
		Text: (x) => makeText(x ? 'Verdadero' : 'Falso'),
		Boolean: (x) => makeBoolean(!!x),
	},
	List: {
		Text: (x: RuntimeValue[], interpreter) => {
			const coercedElementValues: string[] = x?.map(
				(y) => coerceValue(interpreter, y, 'Text').value,
			);
			const listString = coercedElementValues.join('');
			return makeText(`(${listString})`);
		},
		Boolean: (x) => makeBoolean(!!x?.length),
		List: (x) => makeList(Array.isArray(x) ? [...x] : []),
		Registry: (x) => {
			if (!Array.isArray(x)) return null;

			const properties = new Map();
			x.forEach((element, i) => properties.set(i, element));
			return makeRegistry(properties);
		},
	},
	Registry: {
		Text: (x: Map<string, RuntimeValue>, interpreter) => {
			if (!x.size) return makeText('{Rg}');

			const registryStrings: string[] = [];
			x.forEach((value, key) => {
				const coercedValue = coerceValue(interpreter, value, 'Text').value;
				registryStrings.push(`${key}: ${coercedValue}`);
			});
			return makeText(`{Rg ${registryStrings.join(', ')} }`);
		},
		Boolean: (x: Map<string, RuntimeValue>) => makeBoolean(!!x?.size),
		Registry: (x) => makeRegistry(new Map(x)),
	},
	Embed: {
		Text: () => makeText('[Marco]'),
		Boolean: () => makeBoolean(true),
		Registry: (x: EmbedData) => {
			if (x == null || x.data == null) return null;

			return makeEmbedRegistry(x);
		},
	},
	Canvas: {
		Text: () => makeText('[Lienzo]'),
		Boolean: () => makeBoolean(true),
		Registry: (x: PSCanvas) => {
			if (x == null) return null;

			return makeRegistry({
				ancho: makeNumber(x.width),
				alto: makeNumber(x.height),
			});
		},
	},
	Image: {
		Text: () => makeText('[Imagen]'),
		Boolean: () => makeBoolean(true),
		List: (x: ImageValueData) => {
			if (x == null || !(x instanceof Buffer)) return null;

			return makeList([...x.values()].map((v) => makeRuntimeValueFromInternalValue(v)));
		},
		Registry: (x: ImageValueData) => {
			if (x == null || x.buffer == null) return null;

			return makeRegistry({
				formato: makeText(x.format),
				ancho: makeNumber(x.width),
				alto: makeNumber(x.height),
			});
		},
	},
	Function: {
		Text: () => makeText('[Función]'),
		Boolean: () => makeBoolean(true),
	},
	NativeFunction: {
		Text: () => makeText('[Función nativa]'),
		Boolean: () => makeBoolean(true),
	},
	Promise: {
		Text: () => makeText('[Promesa]'),
		Boolean: () => makeBoolean(true),
	},
	Nada: {
		Text: () => makeText('Nada'),
		Boolean: () => makeBoolean(false),
	},
} as const satisfies CoercionMap;

export type InternalValueExtractorMap = {
	[TValueKind in ValueKind]: (
		value: AssertedRuntimeValue<TValueKind>,
	) => CoercibleInternalValue<TValueKind>;
};

export const internalValueExtractors = {
	Number: (v) => v.value,
	Text: (v) => v.value,
	Boolean: (v) => v.value,
	List: (v) => v.elements,
	Registry: (v) => v.entries,
	NativeFunction: () => null as never,
	Function: () => null as never,
	Canvas: (v) => v.canvas,
	Image: (v) => ({ ...v }),
	Promise: (v) => v.promised,
	Embed: (v) => v.value,
	Nada: () => null,
} as const satisfies InternalValueExtractorMap;

export type CoercionFn<
	TSourceKind extends ValueKind,
	TTargetKind extends ValueKind,
> = CoercionMap[TSourceKind][TTargetKind];

export function getCoercionFn<
	TSourceKind extends ValueKind,
	TTargetKind extends keyof CoercionMap[TSourceKind],
>(sourceKind: TSourceKind, targetKind: TTargetKind): CoercionMap[TSourceKind][TTargetKind] {
	return coercions[sourceKind][targetKind];
}

export function extractInternal<TSourceKind extends ValueKind>(
	value: AssertedRuntimeValue<TSourceKind> extends { kind: string }
		? AssertedRuntimeValue<TSourceKind>
		: never,
): CoercibleInternalValue<TSourceKind> {
	if (!(value.kind in internalValueExtractors)) throw '';

	const extractor = internalValueExtractors[value.kind] as (
		v: AssertedRuntimeValue<TSourceKind>,
	) => CoercibleInternalValue<TSourceKind>;

	return extractor(value);
}

export function coerceValue<TTargetKind extends ValueKind>(
	interpreter: Interpreter,
	value: RuntimeValue,
	as: TTargetKind,
): AssertedRuntimeValue<TTargetKind> {
	if (value == null || !value.kind)
		throw interpreter.TuberInterpreterError(
			'Valor de origen corrupto al intentar convertirlo a otro tipo',
		);

	if (value.kind === as) return value as AssertedRuntimeValue<TTargetKind>;

	const fn = getCoercionFn(value.kind, as);

	if (fn == null) {
		throw interpreter.TuberInterpreterError(
			`No se puede convertir un valor de tipo ${ValueKindTranslationLookups.get(
				value.kind,
			)} a ${ValueKindTranslationLookups.get(as) ?? 'Desconocido'}`,
		);
	}

	const internalValue = extractInternal(value);

	const result = fn(internalValue, interpreter);

	if (result == null)
		throw interpreter.TuberInterpreterError('La conversión devolvió un valor nulo inesperado');

	return result as AssertedRuntimeValue<TTargetKind>;
}
