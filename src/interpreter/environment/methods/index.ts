import { type ValueKind, ValueKinds } from '../../values';
import { canvasMethods } from './canvas';
import { embedMethods } from './embed';
import { functionMethods } from './function';
import { listMethods } from './list';
import { nativeFunctionMethods } from './nativeFunction';
import { numberMethods } from './number';
import { registryMethods } from './registry';
import { textMethods } from './text';
import type { MapOfMethodCompilers } from './types';

export const NativeMethodsLookup: Record<ValueKind, MapOfMethodCompilers> = {
	[ValueKinds.NUMBER]: numberMethods,
	[ValueKinds.TEXT]: textMethods,
	[ValueKinds.BOOLEAN]: new Map(),
	[ValueKinds.LIST]: listMethods,
	[ValueKinds.REGISTRY]: registryMethods,
	[ValueKinds.EMBED]: embedMethods,
	[ValueKinds.CANVAS]: canvasMethods,
	[ValueKinds.IMAGE]: new Map(),
	[ValueKinds.NATIVE_FN]: nativeFunctionMethods,
	[ValueKinds.FUNCTION]: functionMethods,
	[ValueKinds.PROMISE]: new Map(),
	[ValueKinds.NADA]: new Map(),
} satisfies Record<ValueKind, MapOfMethodCompilers>;
