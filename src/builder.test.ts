import { getJsonSchema, getMapperOpts } from 'builder';
import User from './builder.test/user.skip.test';
import Article from './builder.test/article.skip.test';

describe('builder', () =>
{
	test(getJsonSchema.name, () =>
	{
		expect(getJsonSchema(User))
			.toEqual(
			{
				type: 'object',
				properties:
				{
					id: { type: 'string' },
				},
			});

		expect(getJsonSchema(Article))
			.toEqual(
			{
				description: 'Resource for testing',
				type: 'object',
				properties:
				{
					id: { type: 'integer' },
					authorId: { type: ['string', 'null'] },
					isPublished: { type: 'boolean' },
					starRating: { type: 'number', minimum: 0, maximum: 5 },
					tags: { type: 'array', items: { type: 'string' } },
				},
			});
	});

	test(getMapperOpts.name, () =>
	{
		expect(getMapperOpts(User))
			.toEqual(
			{
				name: 'user',
				schema: getJsonSchema(User),
				relations:
				{
					hasMany:
					{
						article: { foreignKey: 'authorId', localField: 'articles' },
					},
				},
				idAttribute: 'id',
				recordClass: User,
			});

		expect(getMapperOpts(Article))
			.toEqual(
			{
				name: 'article',
				schema: getJsonSchema(Article),
				relations:
				{
					belongsTo:
					{
						user: { foreignKey: 'authorId', localField: 'author' },
					},
				},
				idAttribute: 'id',
				recordClass: Article,
			});
	});
});
