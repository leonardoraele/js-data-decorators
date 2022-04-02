import { Id, getId, setId, getIdAttr, getIdAttrOrThrow } from 'id';
import { Resource } from './resource';
import { v4 as uuid } from 'uuid';

describe(Id.name, () =>
{
	test('it works', () =>
	{
		@Resource()
		class Subject
		{
			@Id()
			identification: string|number = 0;
		}

		const subject = new Subject();

		expect(getIdAttr(Subject)).toBe('identification');
		expect(() => getIdAttrOrThrow(Subject)).not.toThrow();

		[0, 1, -1, Number.MAX_SAFE_INTEGER, '', '123', 'pipoca', uuid()]
			.forEach(id =>
			{
				setId(subject, id);

				expect(subject.identification).toBe(id);
				expect(getId(subject)).toBe(id);
			});
	});

	test('Resource without id', () =>
	{
		@Resource()
		class Subject {}

		const subject = new Subject();

		expect(getIdAttr(Subject)).toBeNull();
		expect(() => getIdAttrOrThrow(Subject)).toThrow();
		expect(() => getId(subject)).toThrow();
		expect(() => setId(subject, 1)).toThrow();
		expect(() => setId(subject, '1')).toThrow();
	});

	test('it complains about resources with multiple ids', () =>
	{
		expect(() =>
			{
				@Resource()
				// @ts-ignore
				class Subject
				{
					@Id() id1 = 1;
					@Id() id2 = '2';
				}
			})
			.toThrow();
	});
});
