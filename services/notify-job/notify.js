import AWS from "../../libs/aws-sdk";
import config from "../../config";
import handler from "../../libs/handler-lib";

export const main = handler(async (event, _context) => {
  // Parse SNS data
  const { amount, description } = JSON.parse(event.Records[0].Sns.Message);

  const sns = new AWS.SNS();
  await sns
    .publish({
      Message: `Charged ${amount} for ${description}`,
      PhoneNumber: config.adminPhoneNumber
    })
    .promise();

  return { status: true };
});
