import kebabCase from 'lodash.kebabcase';

export const nameMetadata = Symbol('shared-notes-models:name');
export const schemaMetadata = Symbol('shared-notes-models:schema');
export const relationsMetadata = Symbol('shared-notes-models:relations');

export function Resource(name: string, schema?: object): ClassDecorator;
export function Resource(schema?: object): ClassDecorator;
export function Resource(_name?: any, _schema?: any): ClassDecorator
{
	return function(constructor: Function): void
	{
		const schema =
		{
			type: 'object',
			...Reflect.getMetadata(schemaMetadata, constructor),
			..._schema,
		};
		const name = typeof _name === 'string'
			? _name
			: kebabCase(constructor.name);

		Reflect.defineMetadata(nameMetadata, name, constructor);
		Reflect.defineMetadata(schemaMetadata, schema, constructor);
	}
}
