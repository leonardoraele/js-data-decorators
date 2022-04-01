import { schemaMetadata } from './resource';

export function Required(): PropertyDecorator
{
	return function(prototype: object, key: string|symbol): void
	{
		const schema = Reflect.getMetadata(schemaMetadata, prototype.constructor) ?? {};

		schema.required ??= [];
		schema.required.push(key);

		Reflect.defineMetadata(schemaMetadata, schema, prototype.constructor);
	};
}
