import { BelongsTo } from 'belongs-to';
import { Id } from 'id';
import { Property } from 'property';
import { Resource } from 'resource';
import User from './user.skip.test';

@Resource({ description: 'Resource for testing' })
class Article
{
	@Id()
	@Property({ type: 'integer' })
	id: number = 0;

	@Property({ type: ['string', 'null'] })
	authorId: string|null = null;

	@BelongsTo({ resource: 'user'/*, foreignKey: 'authorId' */ })
	author?: User;

	@Property({ type: 'boolean' })
	isPublished: boolean = false;

	@Property({ type: 'number', minimum: 0, maximum: 5 })
	starRating: number = 0;

	@Property({ type: 'array', items: { type: 'string' } })
	tags: string[] = [];
}

export default Article;
