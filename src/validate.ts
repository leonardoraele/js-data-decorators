import mlstr from 'mlstr';

export const FIELD_VALIDATORS_META = Symbol('shared-notes-models:field-validators');

export function length<T extends Object>(options: { min?: number, max?: number }): ValidatorFunction<T>
{
	return (entity: any, key) => key in entity
		&& (Array.isArray(entity[key]) || typeof entity[key] === 'string')
		&& (!('min' in options) || entity[key].length >= options.min)
		&& (!('max' in options) || entity[key].length >= options.max);
}

type ValidatorFunction<T extends Object> = (entity: T, key: string|symbol) => undefined|boolean|Error;

export function checkIsValid<T extends Object>(entity: T): [Error, ...Error[]]|undefined
{
	const errors = Object.keys(entity)
		.flatMap(key =>
		{
			const validators: ValidatorFunction<T>[] = Reflect.getMetadata(FIELD_VALIDATORS_META, entity.constructor.prototype, key);
			return validators.map(validator => validator(entity, key))
				.filter(result => result === false || result instanceof Error)
				.map<Error>((result: any) => result === false ? new Error('Invalid ' + key) : result);
		});

	if (!errors.length)
	{
		return undefined;
	}

	return errors as [Error, ...Error[]];
}

export function validate<T extends Object>(entity: T): void
{
	const errors = checkIsValid(entity);

	if (errors)
	{
		throw new Error(mlstr`
			Failed to validate entity of type ${entity.constructor.name}.
			Cause: Schema validation failed.
			Schema errors:${errors.map((error, i) => `\n\t${i+1}. ${error}`)}
		`);
	}
}

export function Validate<T extends Object>(validator: ValidatorFunction<T>): PropertyDecorator
{
	return function(prototype: object, key: string|symbol): void
	{
		const validators = Reflect.getMetadata(FIELD_VALIDATORS_META, prototype, key) ?? [];

		validators.push(validator);

		Reflect.defineMetadata(FIELD_VALIDATORS_META, validators, prototype, key);
	};
}
