// Checks the file details query without accessing encrypted object contents.
// Owns the regression for metadata display when storage content is unavailable.
// Does not contact the backend or object storage.
import assert from "node:assert/strict";
import { test } from "node:test";
import { execute, GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import GET_POD_SIZE from "./GET_POD_SIZE";

test("loads file size without fetching encrypted content", async () => {
  let contentReads = 0;
  const pod = new GraphQLObjectType({ name: "Pod", fields: {
    id: { type: GraphQLString }, ref_id: { type: GraphQLString }, mime_type: { type: GraphQLString },
    encoding: { type: GraphQLString }, size: { type: GraphQLString }, created_at: { type: GraphQLString },
    updated_at: { type: GraphQLString }, content: { type: GraphQLString, resolve: () => { contentReads++; throw Error("Storage unavailable"); } },
  } });
  const schema = new GraphQLSchema({ query: new GraphQLObjectType({ name: "Query", fields: {
    getPod: { type: pod, args: { ref_id: { type: new GraphQLNonNull(GraphQLID) } }, resolve: () => ({ size: "42" }) },
  } }) });
  const result = await execute({ schema, document: GET_POD_SIZE, variableValues: { ref_id: "file" } });
  assert.equal(contentReads, 0);
  assert.equal(result.errors, undefined);
  assert.equal((result.data?.getPod as { size: string }).size, "42");
});
