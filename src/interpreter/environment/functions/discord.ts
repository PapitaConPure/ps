/** biome-ignore-all lint/correctness/noEmptyPattern: Explicitly stating that all these functions take an array of args. */

import {
	makeNada,
	type NadaValue,
	type NativeFunction,
	type RegistryValue,
	type TextValue,
	ValueKinds,
} from '../../values';
import { expectParam } from '../nativeUtils';
import { makeDiscordChannel, makeDiscordMember, makeDiscordRole } from '../registryPrefabs';
import type { NativeFunctionEntry } from '.';

const buscarCanal: NativeFunction<null, [TextValue], RegistryValue | NadaValue> = (
	_self,
	[búsqueda],
	scope,
) => {
	const búsquedaResult = expectParam('búsqueda', búsqueda, ValueKinds.TEXT, scope);

	const channel = scope.interpreter.provider.fetchChannel(búsquedaResult.value);

	if (!channel) return makeNada();

	return makeDiscordChannel(channel);
};

const buscarMiembro: NativeFunction<null, [TextValue], RegistryValue | NadaValue> = (
	_self,
	[búsqueda],
	scope,
) => {
	const búsquedaResult = expectParam('búsqueda', búsqueda, ValueKinds.TEXT, scope);

	const member = scope.interpreter.provider.fetchMember(búsquedaResult.value);

	if (!member) return makeNada();

	return makeDiscordMember(member);
};

const buscarRol: NativeFunction<null, [TextValue], RegistryValue | NadaValue> = (
	_self,
	[búsqueda],
	scope,
) => {
	const búsquedaResult = expectParam('búsqueda', búsqueda, ValueKinds.TEXT, scope);

	const role = scope.interpreter.provider.fetchRole(búsquedaResult.value);

	if (!role) return makeNada();

	return makeDiscordRole(role);
};

export const discordFunctions: NativeFunctionEntry[] = [
	{ id: 'buscarCanal', fn: buscarCanal as NativeFunction },
	{ id: 'buscarMiembro', fn: buscarMiembro as NativeFunction },
	{ id: 'buscarRol', fn: buscarRol as NativeFunction },
];
