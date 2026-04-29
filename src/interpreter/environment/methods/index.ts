/** biome-ignore-all lint/correctness/noEmptyPattern: Explicitly stating that all these functions take an array of args. */

import {
	type FunctionValue,
	type NativeFunction,
	type NativeFunctionValue,
	type NativeMethod,
	type RuntimeValue,
	type ValueKind,
	ValueKinds,
} from '../../values';
import { canvasMethods } from './canvas';
import { embedMethods } from './embed';
import { listMethods } from './list';
import { numberMethods } from './number';
import { registryMethods } from './registry';
import { textMethods } from './text';

const nativeFunctionMethods = new Map<string, NativeFunction<NativeFunctionValue>>();
nativeFunctionMethods
	.set('enlazar', (self, [valor]) => {
		self.self = valor;
		return self;
	})
	.set('llamar', (self, [enlazado, ...valores], scope) => self.call(enlazado, valores, scope));

const functionMethods = new Map<string, NativeFunction<FunctionValue>>();
functionMethods.set('llamar', (self, [], scope) =>
	self.lambda === true
		? scope.interpreter.evaluate(self.expression, scope)
		: scope.interpreter.evaluateStatement(self.body, scope),
);

type MapOfMethods = Map<string, NativeMethod<RuntimeValue>>;

export const NativeMethodsLookup = {
	[ValueKinds.NUMBER]: numberMethods as MapOfMethods,
	[ValueKinds.TEXT]: textMethods as MapOfMethods,
	[ValueKinds.BOOLEAN]: new Map<string, NativeMethod<RuntimeValue>>(),
	[ValueKinds.LIST]: listMethods as MapOfMethods,
	[ValueKinds.REGISTRY]: registryMethods as MapOfMethods,
	[ValueKinds.EMBED]: embedMethods as MapOfMethods,
	[ValueKinds.CANVAS]: canvasMethods as MapOfMethods,
	[ValueKinds.IMAGE]: new Map<string, NativeMethod<RuntimeValue>>(),
	[ValueKinds.NATIVE_FN]: nativeFunctionMethods as MapOfMethods,
	[ValueKinds.FUNCTION]: functionMethods as MapOfMethods,
	[ValueKinds.PROMISE]: new Map<string, NativeMethod<RuntimeValue>>(),
	[ValueKinds.NADA]: new Map<string, NativeMethod<RuntimeValue>>(),
} as const satisfies Record<ValueKind, MapOfMethods>;
