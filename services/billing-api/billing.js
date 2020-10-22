import AWS from "../../libs/aws-sdk";
import stripePackage from "stripe";
import { calculateCost } from "./libs/billing-lib";
import config from "../../config";
import handler from "../../libs/handler-lib";

// Load our secret key from SSM
const ssm = new AWS.SSM();
const stripeSecretKeyPromise = ssm
  .getParameter({
    Name: config.stripeKeyName,
    WithDecryption: true
  })
  .promise();

export const main = handler(async (event, _context) => {
  const { storage, source } = JSON.parse(event.body);
  const amount = calculateCost(storage);
  const description = "Scratch charge";

  // Charge via stripe
  const stripeSecretKey = await stripeSecretKeyPromise;
  const stripe = stripePackage(stripeSecretKey.Parameter.Value);
  await stripe.charges.create({
    source,
    amount,
    description,
    currency: "usd"
  });

  // Send verification message
  const sns = new AWS.SNS();
  await sns
    .publish({
      Message: JSON.stringify({ amount, description }),
      MessageStructure: "string",
      TopicArn: process.env.notePurchasedTopicArn,
    })
    .promise();

  return { status: true };
});
