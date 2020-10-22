import dynamoDb from "../../libs/dynamodb-lib";
import handler from "../../libs/handler-lib";

export const main = handler(async (event, _context) => {
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    }
  };

  const result = await dynamoDb.get(params);
  if (result.Item) {
    // Return the retrieved item
    return result.Item;
  } else {
    return { status: false, error: "Item not found." };
  }
});
