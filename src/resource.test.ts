import { Resource, getResourceName } from './resource';

describe(Resource.name, () =>
{
	test('it adds metadata information to the resource class', () =>
	{
		@Resource('explicit-resource-name')
		class MyResource {}

		expect(getResourceName(MyResource)).toBe('explicit-resource-name');
	});

	test('it infers the resource name from the the class name if not explicitly provided', () =>
	{
		@Resource()
		class MyResource {}

		expect(getResourceName(MyResource)).toBe('my-resource');
	});
});
