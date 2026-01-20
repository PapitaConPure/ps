/* eslint-disable no-empty-pattern */

import { NativeFunction, RuntimeValue, ValueKind, ValueKinds, NativeFunctionValue, FunctionValue } from '../../values';
import { numberMethods } from './number';
import { textMethods } from './text';
import { listMethods } from './list';
import { registryMethods } from './registry';
import { embedMethods } from './embed';
import { canvasMethods } from './canvas';

const nativeFunctionMethods = new Map<string, NativeFunction<NativeFunctionValue>>();
nativeFunctionMethods
	.set('enlazar', function(self, [ valor ]) {
		self.self = valor;
		return self;
	})
	.set('llamar', function(self, [ enlazado, ...valores ], scope) {
		return self.call(enlazado, valores, scope);
	});

const functionMethods = new Map<string, NativeFunction<FunctionValue>>();
functionMethods.set('llamar', function(self, [], scope) {
	return (self.lambda === true)
		? scope.interpreter.evaluate(self.expression, scope)
		: scope.interpreter.evaluateStatement(self.body, scope);
});

export const NativeMethodsLookup = ({
	[ValueKinds.NUMBER]: numberMethods,
	[ValueKinds.TEXT]: textMethods,
	[ValueKinds.BOOLEAN]: new Map<string, NativeFunction<RuntimeValue>>(),
	[ValueKinds.LIST]: listMethods,
	[ValueKinds.REGISTRY]: registryMethods,
	[ValueKinds.EMBED]: embedMethods,
	[ValueKinds.CANVAS]: canvasMethods,
	[ValueKinds.IMAGE]: new Map<string, NativeFunction<RuntimeValue>>(),
	[ValueKinds.NATIVE_FN]: nativeFunctionMethods,
	[ValueKinds.FUNCTION]: functionMethods,
	[ValueKinds.PROMISE]: new Map<string, NativeFunction<RuntimeValue>>(),
	[ValueKinds.NADA]: new Map<string, NativeFunction<RuntimeValue>>(),
}) as const satisfies Record<ValueKind, Map<string, NativeFunction<RuntimeValue>>>;
