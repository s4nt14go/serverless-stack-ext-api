import { success } from "../../libs/response-lib";

export async function main(event, _context) {
  return success(event.requestContext.identity.cognitoIdentityId);
}
