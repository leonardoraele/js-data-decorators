import { Resource, getResourceName, checkIsResource } from 'resource';

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

	test('checking if is resource', () =>
	{
		@Resource()
		class TestResource {}

		expect(checkIsResource(TestResource)).toBeTruthy();
		expect(checkIsResource(new TestResource)).toBeTruthy();

		// ---------------------------------------------------------------------

		class NotResource {}

		expect(checkIsResource(NotResource)).toBeFalsy();
		expect(checkIsResource(new NotResource)).toBeFalsy();
	});
});
