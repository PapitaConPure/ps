import { BooleanValue, ListValue, NumberValue, RegistryValue, RuntimeValue, TextValue, ValueKinds } from '../../src/interpreter/values';
import { expect } from 'bun:test';

export interface ExpectNumberOptions {
	exactly?: number;
	integer?: boolean;
	min?: number;
	max?: number;
}

export function expectNumber(value: RuntimeValue, options: ExpectNumberOptions = {}): NumberValue {
	const {
		exactly,
		integer,
		min,
		max,
	} = options;

	expect(value).toBeDefined();
	expect(value.kind).toBe(ValueKinds.NUMBER);
	const inferredNumber = value as NumberValue;

	if(exactly != null) {
		expect(inferredNumber.value).toBe(exactly);
		return inferredNumber;
	}

	if(integer === true)
		expect(inferredNumber.value).toBeInteger();
	else if(integer === false)
		expect(inferredNumber.value).not.toBeInteger();

	if(min != null)
		expect(inferredNumber.value).toBeGreaterThanOrEqual(min);

	if(max != null)
		expect(inferredNumber.value).toBeLessThanOrEqual(max);

	return inferredNumber;
}

export interface ExpectTextOptions {
	exactly?: string;
	empty?: boolean;
	match?: string | RegExp;
	startWith?: string;
	endWith?: string;
}

export function expectText(value: RuntimeValue, options: ExpectTextOptions = {}): TextValue {
	const {
		exactly,
		empty,
		match,
		startWith,
		endWith,
	} = options;

	expect(value).toBeDefined();
	expect(value.kind).toBe(ValueKinds.TEXT);
	const inferredText = value as TextValue;

	if(exactly != null) {
		expect(inferredText.value).toBe(exactly);
		return inferredText;
	}

	if(empty != null) {
		if(empty)
			expect(inferredText.value).toBeEmpty();
		else
			expect(inferredText.value).not.toBeEmpty();
	}

	if(match != null)
		expect(inferredText.value).toMatch(match);

	if(startWith != null)
		expect(inferredText.value).toStartWith(startWith);

	if(endWith != null)
		expect(inferredText.value).toEndWith(endWith);

	return inferredText;
}

export interface ExpectBooleanOptions {
	exactly?: boolean;
}

export function expectBoolean(value: RuntimeValue, options: ExpectBooleanOptions = {}): BooleanValue {
	const {
		exactly,
	} = options;

	expect(value).toBeDefined();
	expect(value.kind).toBe(ValueKinds.BOOLEAN);
	const inferredBoolean = value as BooleanValue;

	if(exactly != null)
		expect(inferredBoolean.value).toBe(exactly);

	return inferredBoolean;
}

export interface ExpectListOptions {
	exactly?: RuntimeValue[];
	size?: number;
	every?: (x: RuntimeValue) => boolean;
	some?: (x: RuntimeValue) => boolean;
	none?: (x: RuntimeValue) => boolean;
}

export function expectList(value: RuntimeValue, options: ExpectListOptions = {}): ListValue {
	const {
		exactly,
		size,
		every,
		some,
		none,
	} = options;

	expect(value).toBeDefined();
	expect(value.kind).toBe(ValueKinds.LIST);
	const inferredList = value as ListValue;

	if(exactly != null) {
		expect(inferredList.elements).toBeArrayOfSize(exactly.length);
		expect(inferredList.elements).toSatisfy(list => list.every((el, i) => el.equals(exactly.at(i))));
		return inferredList;
	}

	if(size != null)
		expect(inferredList.elements).toBeArrayOfSize(size);
	else
		expect(inferredList.elements).toBeArray();

	if(every != null)
		expect(inferredList.elements).toSatisfy(v => v.every(every));

	if(some != null)
		expect(inferredList.elements).toSatisfy(v => v.some(some));

	if(none != null)
		expect(inferredList.elements).toSatisfy(v => !v.some(none));

	return inferredList;
}

export interface ExpectRegistryOptions {
	exactly?: Record<string, RuntimeValue>;
	size?: number;
	containKeys?: string[];
	containValues?: RuntimeValue[];
	every?: (k: string, v: RuntimeValue) => boolean;
	some?: (k: string, v: RuntimeValue) => boolean;
	none?: (k: string, v: RuntimeValue) => boolean;
}

export function expectRegistry(value: RuntimeValue, options: ExpectRegistryOptions = {}): RegistryValue {
	const {
		exactly,
		size,
		containKeys,
		containValues,
		every,
		some,
		none,
	} = options;

	expect(value).toBeDefined();
	expect(value.kind).toBe(ValueKinds.REGISTRY);
	const inferredRegistry = value as RegistryValue;
	expect(inferredRegistry.entries).toBeInstanceOf(Map);

	if(exactly != null) {
		const exactlyMap = new Map<string, RuntimeValue>(Object.entries(exactly));
		expect(inferredRegistry.entries.size).toBe(exactlyMap.size);
		expect(inferredRegistry.entries).toSatisfy(registry => registry.entries().every(([ k, v ]) => v.equals(exactlyMap.get(k))));
		return inferredRegistry;
	}

	if(size != null)
		expect(inferredRegistry.entries.size).toBe(size);

	if(containKeys)
		expect(containKeys).toSatisfy(keys => keys.every(k => inferredRegistry.entries.has(k)));

	if(containValues) {
		const registryValues = inferredRegistry.entries.values();
		expect(containValues).toSatisfy(values => values.every(v1 => registryValues.some(v2 => v2.equals(v1))));
	}

	if(every != null)
		expect(inferredRegistry.entries).toSatisfy(v => v.entries().every(([ k, v ]) => every(k, v)));

	if(some != null)
		expect(inferredRegistry.entries).toSatisfy(v => v.entries().some(([ k, v ]) => some(k, v)));

	if(none != null)
		expect(inferredRegistry.entries).toSatisfy(v => !v.entries().some(([ k, v ]) => none(k, v)));

	return inferredRegistry;
}
