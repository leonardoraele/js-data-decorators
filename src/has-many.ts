import kebabCase from 'lodash.kebabcase';
import camelCase from 'lodash.camelcase';
import { singularize } from 'inflection';
import { RESOURCE_RELATIONS_METADATA } from './resource';

export interface HasManyOptions
{
	resource?: Function|string,
	foreignKey?: string,
}

export function HasMany(options: HasManyOptions = {}): PropertyDecorator
{
	return function(prototype: object, key: string|symbol): void
	{
		const relatedResource = typeof options.resource === 'string' ? options.resource
			: typeof options.resource === 'function' ? kebabCase(options.resource.name)
			// TODO Attempt to deduce the name of the resource by checking the typescript type of the property before
			// relying on the property name.
			: kebabCase(singularize(key.toString()));
		const foreignKey = options.foreignKey ?? camelCase(prototype.constructor.name + ' id');
		const localField = key;
		const relations = Reflect.getMetadata(RESOURCE_RELATIONS_METADATA, prototype.constructor) ?? {};

		relations.hasMany ??= {};
		relations.hasMany[relatedResource] = { foreignKey, localField };

		Reflect.defineMetadata(RESOURCE_RELATIONS_METADATA, relations, prototype.constructor);
	}
}
