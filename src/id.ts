import Throw from 'throw2';
import mlstr from 'mlstr';

export const idMetadata = Symbol('shared-notes-models:id');

export function getIdAttr(constructor: Function): string|null
{
	return Reflect.getMetadata(idMetadata, constructor) ?? null;
}

export function getIdAttrOrThrow(constructor: Function): string
{
	return Reflect.getMetadata(idMetadata, constructor)
		?? Throw(mlstr`
			Failed to get id of object of type ${constructor.name}.
			Cause: Class doesn't have a property with the @Id tag.
		`);;
}

export function getId(entity: object): any
{
	const idAttr = getIdAttrOrThrow(entity.constructor);
	return (entity as any)[idAttr];
}

export function setId(entity: object, value: string|number): void
{
	const idAttr = getIdAttrOrThrow(entity.constructor);
	(entity as any)[idAttr] = value;
}

export function Id(): PropertyDecorator
{
	return function(prototype: object, key: string|symbol): void
	{
		if (getIdAttr(prototype.constructor))
		{
			throw new Error('Class must not have more than one @Id decorator.');
		}

		Reflect.defineMetadata(idMetadata, key, prototype.constructor);
	};
}
