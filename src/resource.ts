import kebabCase from 'lodash.kebabcase';

export const RESOURCE_NAME_METADATA = Symbol('js-data-decorators:name');
export const RESOURCE_SCHEMA_METADATA = Symbol('js-data-decorators:schema');
export const RESOURCE_RELATIONS_METADATA = Symbol('js-data-decorators:relations');

export function getResourceName(constructor: Function): string
{
	return Reflect.getMetadata(RESOURCE_NAME_METADATA, constructor);
}

export function Resource(name: string, schema?: object): ClassDecorator;
export function Resource(schema?: object): ClassDecorator;
export function Resource(_name?: any, _schema?: any): ClassDecorator
{
	if (typeof _name === 'object')
	{
		_schema = _name;
		_name = undefined;
	}

	return function(constructor: Function): void
	{
		const schema =
		{
			type: 'object',
			...Reflect.getMetadata(RESOURCE_SCHEMA_METADATA, constructor),
			..._schema,
		};
		const name = typeof _name === 'string'
			? _name
			: kebabCase(constructor.name);

		Reflect.defineMetadata(RESOURCE_NAME_METADATA, name, constructor);
		Reflect.defineMetadata(RESOURCE_SCHEMA_METADATA, schema, constructor);
	}
}

export function checkIsResource(object: Object): boolean;
export function checkIsResource(type: Function): boolean;
export function checkIsResource(subject: Object|Function): boolean
{
	const constructor = typeof subject === 'function'
		? subject
		: subject.constructor;
	return Reflect.hasMetadata(RESOURCE_NAME_METADATA, constructor);
}
