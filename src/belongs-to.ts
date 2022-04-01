import kebabCase from 'lodash.kebabcase';
import camelCase from 'lodash.camelcase';
import { relationsMetadata } from './resource';

export interface BelongsToOptions
{
	resource?: Function|string,
	foreignKey?: string,
}

export function BelongsTo(options: BelongsToOptions = {}): PropertyDecorator
{
	return function(prototype: object, key: string|symbol): void
	{
		const relatedResource = typeof options.resource === 'string' ? options.resource
			: typeof options.resource === 'function' ? kebabCase(options.resource.name)
			: kebabCase(key.toString());
		const foreignKey = options.foreignKey ?? camelCase(key.toString() + ' id');
		const localField = key;

		const relations = Reflect.getMetadata(relationsMetadata, prototype.constructor) ?? {};

		relations.belongsTo ??= {};
		relations.belongsTo[relatedResource] = { foreignKey, localField };

		Reflect.defineMetadata(relationsMetadata, relations, prototype.constructor);
	}
}
