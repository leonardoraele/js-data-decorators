# js-data-decorators

This package provides a set of decorators that facilitate the creation of `js-data` mappers and json schema.

### Example
```javascript
// models/user.js
import { Resource, Id, Property, Required, HasMany } from 'js-data-decorators';

@Resource()
class User {
	@Id()
	@Property({ type: 'integer' })
	id;

	@Property({ type: 'string' })
	@Required()
	name;

	@HasMany({ foreignKey: 'authorId' })
	articles;
}

export default User;
```

```javascript
// models/article.js
import { Resource, Id, Property, BelongsTo } from 'js-data-decorators';

@Resource({ description: 'A article written to a blog.' })
class Article {
	@Id()
	@Property({ type: 'integer' })
	id;

	@Property({ type: ['string', 'null'] })
	@Required()
	authorId;

	@BelongsTo({ resource: 'user' })
	author;

	@Property({ type: 'boolean' })
	@Required()
	isPublished;

	@Property({ type: 'number', minimum: 1, maximum: 5 })
	starRating;

	@Property({ type: 'array', items: { type: 'string' } })
	tags;
}

export default Article;
```

```javascript
import { DataStore } from 'js-data';
import { HttpAdapter } from 'js-data-http';
import User from 'models/user';
import Article from 'models/article';
import { defineMapper } from 'js-data-decortors';

const adapter = new HttpAdapter();
const store = new DataStore();

store.registerAdapter('http', adapter, { 'default': true });

defineMapper(store, User, { endpoint: '/users' });
defineMapper(store, Article, { endpoint: '/articles' });
```

The calls to `defineMapper` in the last two lines of the example above are equivalent to this:

```javascript
store.defineMapper('user', {
	name: 'user',
	schema: {
		type: 'object',
		properties: {
			id: { type: 'integer' },
			name: { type: 'string' },
		},
	},
	relations: {
		hasMany: {
			article: { foreignKey: 'authorId', localField: 'articles' },
		},
	},
	idAttribute: 'id',
	required: ['name'],
	recordClass: User,
	endpoint: '/users',
});

store.defineMapper('article', {
	name: 'article',
	schema: {
		description: 'A article written to a blog.',
		type: 'object',
		properties: {
			id: { type: 'integer' },
			authorId: { type: ['string', 'null'] },
			isPublished: { type: 'boolean' },
			starRating: { type: 'number', minimum: 0, maximum: 5 },
			tags: { type: 'array', items: { type: 'string' } },
		},
	},
	relations: {
		belongsTo: {
			user: { foreignKey: 'authorId', localField: 'author' },
		},
	},
	idAttribute: 'id',
	recordClass: Article,
	endpoint: '/articles',
});
```
