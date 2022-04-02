import { getJsonSchema } from "builder";
import { Property } from "index";
import { Required } from "required";
import { Resource } from "resource";

test('@Required decorator', () =>
{
	@Resource()
	class Subject
	{
		@Required()
		requiredField = null;

		@Property()
		optionalField = null;
	}

	const result = getJsonSchema(Subject);

	expect(result)
		.toEqual(
		{
			type: 'object',
			properties:
			{
				optionalField: {},
			},
			required: ['requiredField'],
		});
});
