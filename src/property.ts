import { getJsonSchema } from '.';
import mlstr from 'mlstr';
import { schemaMetadata } from './resource';
import { Resource } from './resource';
import pick from 'lodash.pick';

interface BasePropertyOptions
{
	type?: JSONType|JSONType[],
	indexed?: boolean,
	description?: string,
}

interface ArrayPropertyOptions extends BasePropertyOptions
{
	type: 'array',
	items?: PropertyOptions,
	uniqueItems?: boolean,
	minItems?: number,
	maxItems?: number,
}

interface ObjectPropertyOptions extends BasePropertyOptions
{
	type: 'object',
	properties?: { [key: string]: PropertyOptions },
	additionalProperties?: any,
	minProperties?: number,
	maxProperties?: number,
	dependencies?: any,
	patternProperties?: any,
	regexp?: string,
}

interface StringPropertyOptions extends BasePropertyOptions
{
	type: 'string',
	minLength?: number,
	maxLength?: number,
	pattern?: string,
}

interface NumberPropertyOptions extends BasePropertyOptions
{
	type: 'number'|'integer',
	minimum?: number,
	maximum?: number,
	exclusiveMinimum?: number,
	exclusiveMaximum?: number,
	multipleOf?: number,
}

type PropertyOptions = BasePropertyOptions
	| ArrayPropertyOptions
	| ObjectPropertyOptions
	| NumberPropertyOptions
	| StringPropertyOptions;

export function Property(options: PropertyOptions = {}): PropertyDecorator
{
	return function(prototype: object, key: string|symbol): void
	{
		// options.type ??= Reflect.getMetadata('design:type', prototype, key);
		const schema = Reflect.getMetadata(schemaMetadata, prototype.constructor) ?? {};

		schema.properties ??= {};
		schema.properties[key] = options;

		Reflect.defineMetadata(schemaMetadata, schema, prototype.constructor);
	}
}

export function serialize<T extends Object>(subject: T): Partial<T>
export function serialize<T extends Object>(subject: T[]): Partial<T>[]
export function serialize<T extends Object>(subject: T|T[]): any
{
	return Array.isArray(subject)
		? serializeMany(subject)
		: serializeOne(subject);
}

function serializeMany<T extends Object>(subject: T[]): Partial<T>[]
{
	return subject.map(item => serializeOne(item));
}

function serializeOne<T extends Object>(subject: T): Partial<T>
{
	const schema = getJsonSchema(subject.constructor) as any;

	if (!schema)
	{
		throw new Error(mlstr`
			Failed to serialize object.
			Cause: Class ${subject.constructor.name} is not a resource.
			Did you forget the @${Resource.name} annotation?
		`);
	}

	const propertyNames = Object.keys(schema.properties ?? {});

	return pick(subject, ...propertyNames);
}

export function deserialize<T extends Object>(type: new (attrs?: Partial<T>) => T, data: Partial<T>): T;
export function deserialize<T extends Object>(type: new (attrs?: Partial<T>) => T, data: Partial<T>[]): T[];
export function deserialize<T extends Object>(type: new (attrs?: Partial<T>) => T, data: Partial<T>|Partial<T>[]): any
{
	return Array.isArray(data)
		? deserializeMany(type, data)
		: deserializeOne(type, data);
}

function deserializeMany<T extends Object>(type: new (attrs?: Partial<T>) => T, data: Partial<T>[]): T[]
{
	return data.map(item => deserializeOne(type, item));
}

function deserializeOne<T extends Object>(type: new (attrs?: Partial<T>) => T, data: Partial<T>): T
{
	// TODO Validate entity
	return Object.assign(new type(), data);
}
