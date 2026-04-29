import type { Interpreter } from '../..';
import type { NativeMethod, RuntimeValue } from '../../values';

// biome-ignore lint/suspicious/noExplicitAny: Without an explicit type parameter, this must represent *any* map of method compilers
export type MapOfMethodCompilers<TValue extends RuntimeValue = any> = Map<
	string,
	(it: Interpreter) => NativeMethod<TValue>
>;
