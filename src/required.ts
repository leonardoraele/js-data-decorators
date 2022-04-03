import { RESOURCE_SCHEMA_METADATA } from './resource';

export function Required(): PropertyDecorator
{
	return function(prototype: object, key: string|symbol): void
	{
		const schema = Reflect.getMetadata(RESOURCE_SCHEMA_METADATA, prototype.constructor) ?? {};

		schema.required ??= [];
		schema.required.push(key);

		Reflect.defineMetadata(RESOURCE_SCHEMA_METADATA, schema, prototype.constructor);
	};
}
