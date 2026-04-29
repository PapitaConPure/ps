/** biome-ignore-all lint/correctness/noEmptyPattern: Explicitly stating that all these functions take an array of args. */

import type { FunctionValue, NativeMethod, RuntimeValue } from '../../values';
import { ensureMethod } from '../nativeUtils';
import type { MapOfMethodCompilers } from './types';

export type FunctionMethod<
	TArg extends RuntimeValue[] = RuntimeValue[],
	TResult extends RuntimeValue = RuntimeValue,
> = NativeMethod<FunctionValue, TArg, TResult>;

const fnLlamar: FunctionMethod<[]> = (self, [], scope) =>
	self.lambda === true
		? scope.interpreter.evaluate(self.expression, scope)
		: scope.interpreter.evaluateStatement(self.body, scope);

export const functionMethods: MapOfMethodCompilers<FunctionValue> = new Map();
functionMethods.set('llamar', (it) => ensureMethod(it).appliesTo(fnLlamar));
