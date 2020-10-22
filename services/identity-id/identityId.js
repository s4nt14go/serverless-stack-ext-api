import handler from "../../libs/handler-lib";

export const main = handler(async (event, _context) => {
  return event.requestContext.identity.cognitoIdentityId;
});
