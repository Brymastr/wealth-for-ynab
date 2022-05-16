import { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse } from 'util/helpers';

export const handler: APIGatewayProxyHandler = async () => {
  return createResponse(200, { message: 'Logout' });
};
