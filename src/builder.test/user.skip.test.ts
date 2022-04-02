import { HasMany } from "has-many";
import { Id } from "id";
import { Property } from "property";
import { Resource } from "resource";
import Article from './article.skip.test';

@Resource()
class User
{
	@Id()
	@Property({ type: 'string' })
	id: string = '';

	@HasMany({ /* resource: 'article', */ foreignKey: 'authorId' })
	articles: Article[] = [];
}

export default User;
