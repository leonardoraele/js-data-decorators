import { deserialize } from 'index';
import { Record } from 'js-data';
import { Property, serialize } from 'property';

describe('serialization and deserialization', () =>
{
	class Subject
	{
		@Property({ type: 'integer' })
		integer: number = 123;

		@Property({ type: 'string' })
		string: string = 'lorem ipsum dolor sit amet';

		@Property({ type: 'number' })
		number: number = 3.14159265;

		@Property({ type: 'null' })
		null: null = null;

		@Property({ type: 'array', items: { type: 'integer' } })
		array: number[] = [1, 2, 3];
	}

	test('serialization', () =>
	{
		const result = serialize(new Subject);

		expect(result)
			.toEqual(
			{
				integer: 123,
				string: 'lorem ipsum dolor sit amet',
				number: 3.14159265,
				null: null,
				array: [1, 2, 3],
			});
	});

	test('deserialization of non-record object', () =>
	{
		const attrs = { integer: 1, string: 'str', number: 0.1, null: null, array: [1, 2, 3] };
		const subject = deserialize(Subject, attrs);

		expect(subject).toBeInstanceOf(Subject);
		expect(subject).toEqual(attrs);
	});

	test('deserialization of rescord object', () =>
	{
		class SubRecord extends Record
		{
			number = 0;
			string = '';
		}

		const attrs = { number: 1, string: 'str' };
		const instance = deserialize(SubRecord, attrs);

		expect(instance).toBeInstanceOf(SubRecord);
		expect(instance).toEqual(attrs);
	});
});
