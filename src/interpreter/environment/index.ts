import type { Scope } from '../scope';
import {
	type AnyNativeFunction,
	makeList,
	makeNada,
	makeNativeFunction,
	makeNumber,
	makeRegistry,
	makeText,
	type RuntimeValue,
	ValueKinds,
} from '../values';
import { EnvironmentProvider } from './environmentProvider';
import { NativeFunctions } from './functions';
import { makeKindFromValue } from './nativeUtils';
import { makeDiscordChannel, makeDiscordGuild, makeDiscordMember } from './registryPrefabs';
import { NativeColorsLookup } from './variables/colors';

export { PSCanvas } from './constructs/psCanvas';
export { PSChannel } from './constructs/psChannel';
export { PSGuild } from './constructs/psGuild';
export { PSMember } from './constructs/psMember';
export { PSRole } from './constructs/psRole';
export { PSUser } from './constructs/psUser';
export { NativeMethodsLookup } from './methods';
export { EnvironmentProvider };

export function declareNatives(scope: Scope) {
	scope.assignVariable('PI', makeNumber(Math.PI));
	scope.assignVariable('E', makeNumber(Math.E));

	for (const [traducción, original] of NativeColorsLookup)
		scope.assignVariable(traducción, makeText(`#${original.toString(16)}`));

	for (const { id, fn } of NativeFunctions) {
		const actualFn = fn(scope.interpreter) as AnyNativeFunction;
		scope.assignVariable(id, makeNativeFunction(null, actualFn));
	}
}

export async function declareContext(
	scope: Scope,
	dataProvider: EnvironmentProvider,
	savedData: Map<string, RuntimeValue> | null = null,
) {
	const member = dataProvider.getMember();
	const channel = dataProvider.getChannel();
	const guild = dataProvider.getGuild();
	member && scope.assignVariable('usuario', await makeDiscordMember(member));
	channel && scope.assignVariable('canal', makeDiscordChannel(channel));
	guild && scope.assignVariable('servidor', await makeDiscordGuild(guild));

	if (savedData != null) {
		savedData.forEach((node, key) => {
			scope.assignVariable(key, recursiveRecoverSavedValues(node));
		});
	}
}

/**@description Convierte recursivamente entradas de Registros, de formato JSON a Mapas ES6.*/
function recursiveRecoverSavedValues(value: RuntimeValue): RuntimeValue {
	switch (value.kind) {
		case ValueKinds.NUMBER:
		case ValueKinds.TEXT:
		case ValueKinds.BOOLEAN:
			return makeKindFromValue(value.kind, value.value);

		case ValueKinds.LIST:
			return makeList(value.elements.map((el) => recursiveRecoverSavedValues(el)));

		case ValueKinds.REGISTRY: {
			const mapEntries = new Map();
			for (const [k, v] of Object.entries(value.entries))
				mapEntries.set(k, recursiveRecoverSavedValues(v));
			return makeRegistry(mapEntries);
		}

		default:
			return makeNada();
	}
}
