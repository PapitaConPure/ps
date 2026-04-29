import type { Interpreter } from '../..';
import type { AnyNativeFunction } from '../../values';

export interface NativeFunctionEntry {
	id: string;
	fn: (it: Interpreter) => AnyNativeFunction<null>;
}
