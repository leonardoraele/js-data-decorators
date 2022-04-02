import { getResourceName, relationsMetadata, schemaMetadata } from './resource';
import { Mapper, Schema } from 'js-data';
import { idMetadata } from './id';

// TODO Use an actual json-schema type definition for return type
export function getJsonSchema(constructor: Function): any|undefined
{
	return Reflect.getMetadata(schemaMetadata, constructor);
}

export function createSchema(constructor: Function): Schema
{
	return new Schema(getJsonSchema(constructor));
}

export function getMapperOpts(constructor: Function): object
{
	const name = getResourceName(constructor);
	const schema = createSchema(constructor);
	const relations = Reflect.getMetadata(relationsMetadata, constructor);
	const idAttribute = Reflect.getMetadata(idMetadata, constructor);
	return { name, schema, relations, idAttribute, recordClass: constructor };
}

export function createMapper(constructor: Function, mapperOptions: object): Mapper
{
	return new Mapper({ ...getMapperOpts(constructor), ...mapperOptions });
}
