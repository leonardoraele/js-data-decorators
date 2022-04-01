import { getMapperOpts, getJsonSchema } from './builder';
import { Id } from './id';
import { Resource } from './resource';
import { Required } from './required';
import { Property } from './property';

describe('builder', () =>
{
	// TODO Add relationships to the test resource
	@Resource({ description: 'Resource for testing' })
	class MyResource
	{
		@Id() @Property({ type: 'integer' }) id = 1;
		@Property({ type: 'array' }) numbers = [1, 2, 3];
		@Property({ type: 'boolean' }) @Required() isValid = true;
		@Property({ type: 'integer' }) @Required() magicNumber = 1;
		@Property({ type: 'number' }) @Required() pi = 3.14159265359;
		@Property({ type: 'null' }) none = null;
		@Property({ type: 'object' }) details = {};
		@Property({ type: 'string' }) name = 'some item';
		@Property({ type: ['integer', 'null'] }) maybeNumber = null as number|null;
	}

	test(getJsonSchema.name, () =>
	{
		expect(getJsonSchema(MyResource))
			.toEqual(
			{
				description: 'Resource for testing',
				type: 'object',
				properties:
				{
					id: { type: 'integer' },
					numbers: { type: 'array' },
					isValid: { type: 'boolean' },
					magicNumber: { type: 'integer' },
					pi: { type: 'number' },
					none: { type: 'null' },
					details: { type: 'object' },
					name: { type: 'string' },
					maybeNumber: { type: ['integer', 'null'] },
				},
				required: ['isValid', 'magicNumber', 'pi'],
			})
	});

	test(getMapperOpts.name, () =>
	{
		expect(getMapperOpts(MyResource))
			.toEqual(
			{
				name: 'my-resource',
				schema: getJsonSchema(MyResource),
				relations: undefined,
				idAttribute: 'id',
				recordClass: MyResource,
			});
	});
});
