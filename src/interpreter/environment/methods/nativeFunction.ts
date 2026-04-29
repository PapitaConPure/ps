import type { NativeFunctionValue, NativeMethod, RuntimeValue } from '../../values';
import { ensureMethod } from '../nativeUtils';
import type { MapOfMethodCompilers } from './types';

export type NativeFunctionMethod<
	TArg extends RuntimeValue[] = RuntimeValue[],
	TResult extends RuntimeValue = RuntimeValue,
> = NativeMethod<NativeFunctionValue, TArg, TResult>;

const nfnEnlazar: NativeFunctionMethod<[RuntimeValue], NativeFunctionValue> = (self, [valor]) => {
	self.self = valor;
	return self;
};

const nfnLlamar: NativeFunctionMethod<RuntimeValue[]> = (self, [enlazado, ...valores], scope) =>
	self.call(enlazado, valores, scope);

export const nativeFunctionMethods: MapOfMethodCompilers<NativeFunctionValue> = new Map();
nativeFunctionMethods
	.set('enlazar', (it) => ensureMethod(it).arg().appliesTo(nfnEnlazar))
	.set('llamar', (it) => ensureMethod(it).rest().appliesTo(nfnLlamar));
