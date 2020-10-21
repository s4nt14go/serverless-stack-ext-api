import dynamoDb from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, _context) {
  const params = {
    TableName: process.env.tableName,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    //   partition key
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be Identity Pool identity id
    //   of the authenticated user
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.identity.cognitoIdentityId
    }
  };

  try {
    const result = await dynamoDb.query(params);
    // Return the matching list of items in response body
    return success(result.Items);
  } catch (e) {
    console.log('e', e);
    return failure({ status: false });
  }
}
